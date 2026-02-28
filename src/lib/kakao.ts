import { Capacitor } from '@capacitor/core';

export function getKakaoRedirectUri(): string {
  if (Capacitor.isNativePlatform()) {
    return process.env.NEXT_PUBLIC_KAKAO_REDIRECT_APP ?? '';
  }
  return process.env.NEXT_PUBLIC_KAKAO_REDIRECT_WEB ?? '';
}

export function getKakaoAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID ?? '';
  const redirectUri = getKakaoRedirectUri();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  });
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}
