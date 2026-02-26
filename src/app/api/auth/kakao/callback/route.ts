import { NextRequest, NextResponse } from 'next/server';

/**
 * 카카오 OAuth Redirect URI: /api/auth/kakao/callback
 * 카카오가 이 URL로 리다이렉트 → /login?code=...&from=kakao 로 302
 * 카카오 개발자 콘솔에 https://sumtayo.co.kr/api/auth/kakao/callback 등록 필요
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  const origin = baseUrl.replace(/\/$/, '') || req.nextUrl.origin;
  const loginUrl = `${origin}/login/`;

  if (error) {
    const errMsg = errorDescription || error;
    const url = `${loginUrl}?error=${encodeURIComponent(error)}${errMsg ? `&error_description=${encodeURIComponent(errMsg)}` : ''}`;
    return NextResponse.redirect(url);
  }

  if (!code) {
    return NextResponse.redirect(`${loginUrl}?error=no_code`);
  }

  return NextResponse.redirect(`${loginUrl}?code=${encodeURIComponent(code)}&from=kakao`);
}
