'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { MobileLayout } from '@/components/layout';
import { exchangeKakaoCode, getKakaoAuthUrl, setPendingJoin } from '@/lib/kakao-auth';
import { loginSns, setAccessToken } from '@/lib/api';
import styles from './page.module.scss';

const ERROR_MSG: Record<string, string> = {
  Configuration: '서버 설정 오류입니다.',
  OAuthCallback: '카카오 로그인 연동에 실패했습니다.',
  OAuthAccountNotLinked: '이미 다른 방법으로 가입된 계정입니다.',
  Default: '로그인 중 오류가 났습니다. 다시 시도해 주세요.',
};

const processedCodes = new Set<string>();

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const handlingRef = useRef(false);

  const errorCode = searchParams.get('error');
  const errorDesc = searchParams.get('error_description');
  const errorMsg = error ?? (errorCode ? ERROR_MSG[errorCode] ?? ERROR_MSG.Default : null);

  const processUser = (user: { id: string; email?: string; name?: string; profileImage?: string | null }) => {
    if (handlingRef.current || !user?.id) return;
    handlingRef.current = true;
    (async () => {
      try {
        const res = await loginSns({
          provider: 'kakao',
          providerId: String(user.id),
          email: String(user.email ?? ''),
        });
        if (res.success && 'accessToken' in res && res.accessToken) {
          setAccessToken(res.accessToken);
          router.replace('/');
          return;
        }
        if ('needJoin' in res && res.needJoin) {
          setPendingJoin({
            provider: 'kakao',
            providerId: String(user.id),
            email: String(user.email ?? ''),
            name: String(user.name ?? ''),
            image: user.profileImage ?? null,
          });
          router.replace('/login/nickname/');
        } else {
          setError('로그인에 실패했습니다.');
        }
      } catch {
        setError('로그인 처리 중 오류가 발생했습니다.');
      } finally {
        handlingRef.current = false;
      }
    })();
  };

  useEffect(() => {
    const code = searchParams.get('code');
    const from = searchParams.get('from');
    const redirectUri = searchParams.get('redirect_uri') ?? undefined;
    if (!code || from !== 'kakao' || processedCodes.has(code)) return;
    processedCodes.add(code);
    setError(null);
    exchangeKakaoCode(code, redirectUri)
      .then((result) => {
        if (result.success && result.user) {
          handlingRef.current = false;
          processUser(result.user);
        } else {
          setError(!result.success && 'error' in result ? result.error || '토큰 교환 실패' : '토큰 교환 실패');
        }
      })
      .catch(() => setError('로그인 처리 중 오류가 발생했습니다.'));
  }, [searchParams]);

  const handleKakaoLogin = () => {
    setError(null);
    try {
      window.location.href = getKakaoAuthUrl();
    } catch (e) {
      setError(e instanceof Error ? e.message : '카카오 로그인을 시작할 수 없습니다.');
    }
  };

  return (
    <MobileLayout hideBottomNav>
      <div className={styles.container}>
        {errorMsg && (
          <div className={styles.errorBanner} role="alert">
            {errorMsg}
            {errorDesc && <span className={styles.errorCode}>{errorDesc}</span>}
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
