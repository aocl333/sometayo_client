'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui';
import { MobileLayout } from '@/components/layout';
import {
  getKakaoAuthUrl,
  exchangeKakaoCode,
  setPendingJoin,
  APP_SCHEME,
  PENDING_KAKAO_CODE_KEY,
  KAKAO_DEEPLINK_EVENT,
} from '@/lib/kakao-auth';
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

  const processCode = (code: string) => {
    if (handlingRef.current || !code) return;
    handlingRef.current = true;
    sessionStorage.removeItem(PENDING_KAKAO_CODE_KEY);
    (async () => {
      try {
        const result = await exchangeKakaoCode(code);
        if (!result.success) {
          setNativeError(result.error || '토큰 교환 실패');
          return;
        }
        const { user } = result;
        const loginResult = await loginSns({
          provider: 'kakao',
          providerId: user.id,
          email: user.email || '',
        });
        if (loginResult.success && 'accessToken' in loginResult && loginResult.accessToken) {
          setAccessToken(loginResult.accessToken);
          router.replace('/');
          return;
        }
        if ('needJoin' in loginResult && loginResult.needJoin) {
          setPendingJoin({
            provider: 'kakao',
            providerId: user.id,
            email: user.email || '',
            name: user.name || '',
            image: user.profileImage || null,
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

  // 딥링크 code 처리: 이벤트 또는 sessionStorage (KakaoDeepLinkCapture가 저장 후 /login/으로 옴)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onCode = (e: Event) => {
      const code = (e as CustomEvent<{ code: string }>).detail?.code;
      if (code) processCode(code);
    };
    window.addEventListener(KAKAO_DEEPLINK_EVENT, onCode);
    const codeFromStorage = sessionStorage.getItem(PENDING_KAKAO_CODE_KEY);
    if (codeFromStorage) processCode(codeFromStorage);
    return () => window.removeEventListener(KAKAO_DEEPLINK_EVENT, onCode);
  }, [router]);

  // 웹: callback이 ?code=...&from=kakao 로 리다이렉트한 경우
  useEffect(() => {
    const code = searchParams.get('code');
    const from = searchParams.get('from');
    if (!code || from !== 'kakao' || handlingRef.current) return;
    processCode(code);
  }, [searchParams]);

  const handleKakaoLogin = async () => {
    setNativeError(null);
    if (typeof window === 'undefined') return;
    try {
      const url = getKakaoAuthUrl();
      const isWeb = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isWeb) {
        signIn('kakao', { callbackUrl: '/login/complete/', redirect: true });
        return;
      }
      const cap = await import('@capacitor/core').catch(() => null);
      const app = await import('@capacitor/app').catch(() => null);
      const browser = await import('@capacitor/browser').catch(() => null);
      const isNative = cap?.Capacitor?.isNativePlatform?.() && app?.App && browser?.Browser;
      if (isNative && app?.App && browser?.Browser) {
        const remove = await app.App.addListener('appUrlOpen', async (ev: { url: string }) => {
          const u = ev?.url || '';
          if (!u.includes(`${APP_SCHEME}://kakao`) || handlingRef.current) return;
          try {
            remove.remove();
            (browser.Browser as { close?: () => Promise<void> }).close?.();
          } catch { /* ignore */ }
          const parsed = new URL(u);
          const code = parsed.searchParams.get('code');
          const err = parsed.searchParams.get('error');
          if (err) {
            setNativeError(decodeURIComponent(err));
            return;
          }
          if (code) {
            sessionStorage.setItem(PENDING_KAKAO_CODE_KEY, code);
            window.dispatchEvent(new CustomEvent(KAKAO_DEEPLINK_EVENT, { detail: { code } }));
          }
        });
        await browser.Browser.open({ url });
        return;
      }
      window.location.href = url;
    } catch (err) {
      setNativeError(err instanceof Error ? err.message : '카카오 로그인을 시작할 수 없습니다.');
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
