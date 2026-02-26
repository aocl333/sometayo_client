'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { MobileLayout } from '@/components/layout';
import { exchangeKakaoCode, getKakaoAuthUrl, setPendingJoin } from '@/lib/kakao-auth';
import { loginSns, setAccessToken } from '@/lib/api';
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
  const router = useRouter();
  const [nativeError, setNativeError] = useState<string | null>(null);
  const handlingRef = useRef(false);

  const errorCode = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  const errorMsg =
    nativeError ||
    (errorCode ? (ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default) : null);
  const showCode = Boolean(errorCode && !ERROR_MESSAGES[errorCode]);

  const processKakaoUser = (user: { id: string; email?: string; name?: string; profileImage?: string | null }) => {
    if (handlingRef.current || !user?.id) return;
    handlingRef.current = true;
    (async () => {
      try {
        const loginResult = await loginSns({
          provider: 'kakao',
          providerId: String(user.id),
          email: String(user.email ?? ''),
        });
        if (loginResult.success && 'accessToken' in loginResult && loginResult.accessToken) {
          setAccessToken(loginResult.accessToken);
          router.replace('/');
          return;
        }
        if ('needJoin' in loginResult && loginResult.needJoin) {
          setPendingJoin({
            provider: 'kakao',
            providerId: String(user.id),
            email: String(user.email ?? ''),
            name: String(user.name ?? ''),
            image: user.profileImage ?? null,
          });
          router.replace('/login/nickname/');
        } else {
          setNativeError('로그인에 실패했습니다.');
        }
      } catch {
        setNativeError('로그인 처리 중 오류가 발생했습니다.');
      } finally {
        handlingRef.current = false;
      }
    })();
  };

  // 웹·로컬: URL에 ?code=...&from=kakao 로 들어온 경우 (카카오 → callback → /login 리다이렉트)
  useEffect(() => {
    const code = searchParams.get('code');
    const from = searchParams.get('from');
    const redirectUri = searchParams.get('redirect_uri') ?? undefined;
    if (!code || from !== 'kakao' || handlingRef.current) return;
    handlingRef.current = true;
    exchangeKakaoCode(code, redirectUri)
      .then((result) => {
        if (result.success && result.user) {
          processKakaoUser(result.user);
        } else {
          setNativeError(result.success ? '' : (result.error || '토큰 교환 실패'));
        }
      })
      .catch(() => setNativeError('로그인 처리 중 오류가 발생했습니다.'))
      .finally(() => {
        handlingRef.current = false;
      });
  }, [searchParams]);

  const runNativeKakaoLogin = async () => {
    const { KakaoLoginPlugin } = await import(/* webpackIgnore: true */ 'capacitor-kakao-login-plugin');
    const res = await KakaoLoginPlugin.goLogin();
    const resAny = res as { id?: string; userId?: string; openId?: string; email?: string; nickname?: string; profileImage?: string };
    const id = resAny?.id ?? resAny?.userId ?? resAny?.openId;
    if (!id) {
      setNativeError('카카오 로그인에 실패했습니다.');
      return;
    }
    let userInfo: { id?: string; nickname?: string; email?: string; profile_image_url?: string } = {};
    try {
      const infoRes = await KakaoLoginPlugin.getUserInfo();
      if (infoRes?.value && typeof infoRes.value === 'object') {
        userInfo = infoRes.value as typeof userInfo;
      }
    } catch {
      // ignore
    }
    const userId = String(id);
    const email = String(userInfo?.email ?? resAny?.email ?? '');
    const name = String(userInfo?.nickname ?? resAny?.nickname ?? '');
    const profileImage = userInfo?.profile_image_url ?? resAny?.profileImage ?? null;
    processKakaoUser({ id: userId, email, name, profileImage });
  };

  const handleKakaoLogin = async () => {
    setNativeError(null);
    if (typeof window === 'undefined') return;
    const isLocalhost =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // localhost: 웹 개발용 Redirect URI 플로우
    if (isLocalhost) {
      try {
        window.location.href = getKakaoAuthUrl();
      } catch (err) {
        setNativeError(err instanceof Error ? err.message : '카카오 로그인을 시작할 수 없습니다.');
      }
      return;
    }

    // 그 외(앱 WebView 222.x, 실기기 등): 네이티브 로그인 시도 (isNativePlatform 안 써도 플러그인 있으면 동작)
    try {
      await runNativeKakaoLogin();
    } catch {
      setNativeError('앱에서 로그인해 주세요.');
    }
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
