'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MobileLayout, Header, BottomNav } from '@/components/layout';
import { Button } from '@/components/ui';
import { getUserInfo, updateUserProfile } from '@/lib/api';
import styles from './page.module.scss';

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [nickname, setNickname] = useState('');
  const [profileImagePath, setProfileImagePath] = useState('');
  const [imageError, setImageError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (status !== 'authenticated') return;
    let mounted = true;
    getUserInfo().then((info) => {
      if (!mounted) return;
      if (info) {
        setNickname(info.nickname ?? '');
        setProfileImagePath(info.profileImagePath ?? '');
      } else if (session?.user) {
        setNickname(session.user.name ?? '');
        setProfileImagePath(session.user.image ?? '');
      }
    });
    return () => { mounted = false; };
  }, [session, status, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const name = nickname.trim();
    if (!name) {
      setError('닉네임을 입력해 주세요.');
      return;
    }
    setSaving(true);
    try {
      await updateUserProfile({
        nickname: name,
        profileImagePath: profileImagePath.trim() || undefined,
      });
      router.back();
    } catch {
      setError('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <MobileLayout>
        <Header title="내 정보 수정" showBack />
        <main className={styles.main}><div className={styles.loading}>로딩 중...</div></main>
        <BottomNav />
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <Header title="내 정보 수정" showBack />
      <main className={styles.main}>
        <section className={styles.section}>
          <form onSubmit={onSubmit} className={styles.form}>
            {error && <p className={styles.error} role="alert">{error}</p>}

            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {profileImagePath && !imageError ? (
                  <img
                    src={profileImagePath}
                    alt="프로필"
                    className={styles.avatarImage}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span className={styles.avatarPlaceholder}></span>
                )}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="nickname" className={styles.label}>닉네임 <span className={styles.required}>*</span></label>
              <input
                id="nickname"
                type="text"
                className={styles.input}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
                maxLength={20}
                autoComplete="nickname"
              />
            </div>

            <Button type="submit" fullWidth size="lg" loading={saving} className={styles.submit}>
              저장
            </Button>
          </form>
        </section>
      </main>
      <BottomNav />
    </MobileLayout>
  );
}
