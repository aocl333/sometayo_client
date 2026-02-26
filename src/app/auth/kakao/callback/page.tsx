'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const APP_SCHEME = 'sumtayo';

/**
 * 카카오 OAuth 콜백 (앱 딥링크용)
 * 카카오가 이 URL로 리다이렉트 → code를 앱 스킴으로 넘겨 앱이 받도록 함
 * Redirect URI: https://sumtayo.kr/auth/kakao/callback
 */
function CallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    if (error) {
      const errorDesc = searchParams.get('error_description') ?? error;
      window.location.href = `${APP_SCHEME}://kakao?error=${encodeURIComponent(errorDesc)}`;
      return;
    }
    if (code) {
      window.location.href = `${APP_SCHEME}://kakao?code=${encodeURIComponent(code)}`;
    }
  }, [searchParams]);

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <p>로그인 처리 중...</p>
    </div>
  );
}

export default function AuthKakaoCallbackPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24, textAlign: 'center' }}>로딩 중...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
