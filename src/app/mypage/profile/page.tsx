'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Camera } from 'lucide-react';
import { MobileLayout, Header, BottomNav } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { updateUserProfile, uploadProfileImage } from '@/lib/api';
import styles from './page.module.scss';

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState('');
  const [profileImagePath, setProfileImagePath] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
      return;
    }
    if (session?.user) {
      setNickname(session.user.name ?? '');
      setProfileImagePath(session.user.image ?? '');
    }
  }, [session, status, router]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageError(false);
    e.target.value = '';
  };

  const displayImageUrl = previewUrl ?? (profileImagePath.trim() && !imageError ? profileImagePath.trim() : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError('닉네임을 입력해 주세요.');
      return;
    }
    setSaving(true);
    try {
      let imagePath: string | undefined = profileImagePath.trim() || undefined;
      if (selectedFile) {
        imagePath = await uploadProfileImage(selectedFile);
      }
      await updateUserProfile({
        nickname: trimmed,
        profileImagePath: imagePath,
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
          <Card className={styles.card} padding="md">
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <p className={styles.error} role="alert">{error}</p>}

              <div className={styles.avatarSection}>
                <div className={styles.avatarWithCamera}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                    aria-label="프로필 이미지 선택"
                  />
                  <div className={styles.avatarWrapper}>
                    {displayImageUrl ? (
                      <img
                        src={displayImageUrl}
                        alt="프로필 미리보기"
                        className={styles.avatarImage}
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span className={styles.avatarPlaceholder}>👤</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className={styles.cameraBtn}
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="이미지 변경"
                  >
                    <Camera size={18} strokeWidth={2} />
                  </button>
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
          </Card>
        </section>
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
