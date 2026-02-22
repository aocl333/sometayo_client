'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui';
import { MobileLayout } from '@/components/layout';
import styles from './page.module.scss';

const ERROR_MESSAGES: Record<string, string> = {
  Configuration: '서버 설정 오류입니다.',
  OAuthCallback: '카카오 로그인 연동에 실패했습니다.',
  OAuthCreateAccount: '계정 생성에 실패했습니다.',
  Callback: '로그인 처리 중 오류가 발생했습니다.',
  OAuthAccountNotLinked: '이미 다른 방법으로 가입된 계정입니다.',
  CallbackRouteError: '로그인 처리 중 오류가 발생했습니다.',
  OAuthSignin: '카카오 로그인 요청에 실패했습니다.',
  kakao: '카카오 로그인 중 오류가 발생했습니다.',
  Default: '로그인 중 오류가 났습니다. 다시 시도해 주세요.',
};

function LoginContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const errorMsg = errorCode ? (ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default) : null;
  const showCode = errorCode && !ERROR_MESSAGES[errorCode];

  const handleKakaoLogin = () => {
    signIn('kakao', { callbackUrl: '/', redirect: true });
  };

  return (
    <MobileLayout hideBottomNav>
      <div className={styles.container}>
        {errorMsg && (
          <div className={styles.errorBanner} role="alert">
            {errorMsg}
            {errorDescription && <span className={styles.errorCode}>{errorDescription}</span>}
            {showCode && !errorDescription && <span className={styles.errorCode}>({errorCode})</span>}
          </div>
        )}
        <div className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <img
              src="/images/logo_login.svg"
              alt="썸타요 - 제주 여행의 새로운 경험"
              className={styles.logoImage}
            />
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
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9 0.5C4.029 0.5 0 3.591 0 7.41c0 2.424 1.612 4.55 4.036 5.754l-1.028 3.764c-.09.333.287.598.576.408l4.503-2.976c.297.025.6.044.913.044 4.971 0 9-3.091 9-6.994C18 3.591 13.971 0.5 9 0.5Z"
                  fill="#000000"
                />
              </svg>
            }
          >
            카카오로 시작하기
          </Button>

          <div className={styles.terms}>
            <p>
              로그인 시 <a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의합니다.
            </p>
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
