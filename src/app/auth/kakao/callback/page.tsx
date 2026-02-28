'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginSns, setAccessToken } from '@/lib/api';
import { getKakaoRedirectUri } from '@/lib/kakao';
import { setPendingJoin } from '@/lib/kakao-auth';

/** 백엔드 GET /auth/kakao/callback → sumtayo://auth/kakao/callback?code=XXX 로 넘어온 code로 로그인/가입 처리 */
function KakaoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const exchangedRef = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('잘못된 접근입니다.');
      return;
    }
    // 인가 코드는 1회용. Strict Mode 등으로 effect가 두 번 돌면 KOE320 발생 → 한 번만 실행
    if (exchangedRef.current) return;
    exchangedRef.current = true;

    // 1. code → 카카오 액세스토큰
    fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? '',
        redirect_uri: getKakaoRedirectUri(),
        code,
      }),
    })
      .then((res) => res.json())
      .then(async (tokenData) => {
        if (tokenData.error) {
          setError('카카오 토큰 발급 실패');
          return;
        }
        // 2. 액세스토큰 → 카카오 유저정보
        const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        const user = await userRes.json();

        const provider = 'kakao';
        const providerId = String(user.id);
        const email = user.kakao_account?.email ?? '';
        const name = user.kakao_account?.profile?.nickname ?? '';
        const profileImagePath = user.kakao_account?.profile?.profile_image_url ?? '';

        // 3. 로그인 시도
        const loginResult = await loginSns({ provider, providerId, email });

        if (loginResult.success && 'accessToken' in loginResult && loginResult.accessToken) {
          setAccessToken(loginResult.accessToken);
          router.replace('/');
          return;
        }

        // 4. 신규회원 → 닉네임 페이지
        setPendingJoin({ provider, providerId, email, name, image: profileImagePath || null });
        router.replace('/login/nickname/');
      })
      .catch(() => setError('로그인 처리 중 오류'));
  }, [searchParams, router]);

  const centerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 24,
  };

  if (error) {
    return (
      <div style={centerStyle}>
        <p style={{ margin: '0 0 16px' }}>{error}</p>
        <button type="button" onClick={() => router.replace('/login/')}>
          로그인으로
        </button>
      </div>
    );
  }

  return (
    <div style={centerStyle}>
      <p style={{ margin: 0 }}>로그인 중...</p>
    </div>
  );
}

export default function KakaoCallbackPage() {
  const centerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 24,
  };

  return (
    <Suspense fallback={<div style={centerStyle}><p style={{ margin: 0 }}>로그인 중...</p></div>}>
      <KakaoCallbackContent />
    </Suspense>
  );
}
