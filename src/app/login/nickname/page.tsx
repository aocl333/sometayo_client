'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout, Header } from '@/components/layout';
import { Button } from '@/components/ui';
import { checkNicknameDuplicate, updateUserProfile } from '@/lib/api';
import styles from './page.module.scss';

export default function NicknamePage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [duplicateError, setDuplicateError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
      await updateUserProfile({ nickname: trimmed });
      router.replace('/');
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
