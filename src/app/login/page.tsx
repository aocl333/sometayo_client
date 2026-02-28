'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui';
import { MobileLayout } from '@/components/layout';
import { getKakaoAuthUrl } from '@/lib/kakao';
import styles from './page.module.scss';

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const errorDesc = searchParams.get('error_description');
  const errorMsg = error ? (errorDesc ? `${error}: ${errorDesc}` : error) : null;

  const handleKakaoLogin = () => {
    try {
      window.location.href = getKakaoAuthUrl();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <MobileLayout hideBottomNav>
      <div className={styles.container}>
        {errorMsg && (
          <div className={styles.errorBanner} role="alert">
            {errorMsg}
          </div>
        )}
        <div className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <img src="/images/logo_login.svg" alt="썸타요" className={styles.logoImage} />
          </div>
        </div>
        <div className={styles.loginSection}>
          <Button
            variant="kakao"
            size="lg"
            fullWidth
            onClick={handleKakaoLogin}
            leftIcon={
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M9 0.5C4.029 0.5 0 3.591 0 7.41c0 2.424 1.612 4.55 4.036 5.754l-1.028 3.764c-.09.333.287.598.576.408l4.503-2.976c.297.025.6.044.913.044 4.971 0 9-3.091 9-6.994C18 3.591 13.971 0.5 9 0.5Z" fill="#000" />
              </svg>
            }
          >
            카카오로 시작하기
          </Button>
          <div className={styles.terms}>
            <p>로그인 시 <a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의합니다.</p>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<MobileLayout hideBottomNav><div className={styles.container} /></MobileLayout>}>
      <LoginContent />
    </Suspense>
  );
}
