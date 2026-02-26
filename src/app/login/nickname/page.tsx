'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MobileLayout, Header } from '@/components/layout';
import { Button } from '@/components/ui';
import { checkNicknameDuplicate, joinSns, setAccessToken } from '@/lib/api';
import { getPendingJoin, clearPendingJoin } from '@/lib/kakao-auth';
import styles from './page.module.scss';

const DEFAULT_PHONE = '01000000000'; // 카카오 미제공

export default function NicknamePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [nickname, setNickname] = useState('');
  const [duplicateError, setDuplicateError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const initialFilled = useRef(false);
  const pendingJoin = getPendingJoin();

  // 웹도 앱도 아닌 상태로 이 페이지 접근 시 로그인으로
  useEffect(() => {
    if (!session?.user && !pendingJoin) {
      router.replace('/login');
    }
  }, [session?.user, pendingJoin, router]);

  // 카카오에서 받아온 닉네임 있으면 먼저 채움 (웹: session, 앱: pendingJoin)
  useEffect(() => {
    if (initialFilled.current) return;
    const name = session?.user?.name ?? pendingJoin?.name;
    if (name != null && String(name).trim() !== '') {
      setNickname(String(name).trim());
      initialFilled.current = true;
    }
  }, [session?.user?.name, pendingJoin?.name]);

  const trimmed = nickname.trim();
  const isValid = trimmed.length >= 2;
  const canSubmit = isValid && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setDuplicateError(false);
    setSubmitting(true);
    try {
      const isDuplicate = await checkNicknameDuplicate(trimmed);
      if (isDuplicate) {
        setDuplicateError(true);
        setSubmitting(false);
        return;
      }
      const email = session?.user?.email ?? pendingJoin?.email ?? '';
      const provider = session?.user?.provider ?? pendingJoin?.provider ?? 'kakao';
      const providerId = session?.user?.providerId ?? pendingJoin?.providerId ?? '';
      const image = session?.user?.image ?? pendingJoin?.image ?? '';
      const joinOk = await joinSns({
        email,
        provider,
        providerId,
        nickname: trimmed,
        phone: DEFAULT_PHONE,
        profileImagePath: image,
      });
      if (joinOk.success && 'accessToken' in joinOk && joinOk.accessToken) {
        clearPendingJoin();
        setAccessToken(joinOk.accessToken);
        router.replace('/');
      }
    } catch {
      setDuplicateError(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    if (duplicateError) setDuplicateError(false);
  };

  return (
    <MobileLayout hideBottomNav>
      <Header showBack />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            반가워요!
            <br />
            닉네임을 입력해주세요.
          </h1>

          <form id="nickname-form" onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={nickname}
            onChange={handleInputChange}
            placeholder="2자 이상 입력"
            className={`${styles.input} ${duplicateError ? styles.inputError : ''}`}
            maxLength={20}
            autoComplete="nickname"
            aria-invalid={duplicateError}
            aria-describedby={duplicateError ? 'nickname-error' : undefined}
          />
          {duplicateError && (
            <p id="nickname-error" className={styles.errorMessage} role="alert">
              이미 사용중인 닉네임입니다. 다른 닉네임을 입력해 주세요.
            </p>
          )}
          </form>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <Button
          type="submit"
          form="nickname-form"
          variant="primary"
          size="lg"
          fullWidth
          disabled={!canSubmit}
          loading={submitting}
          className={styles.submitButton}
        >
          확인
        </Button>
      </div>
    </MobileLayout>
  );
}
