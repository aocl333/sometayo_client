import { NextRequest, NextResponse } from 'next/server';

/** 카카오 Redirect URI → /login?code=...&from=kakao 로 302 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const origin = req.nextUrl.origin;
  const loginUrl = `${origin}/login/`;

  if (error) {
    const q = new URLSearchParams({ error });
    if (errorDescription) q.set('error_description', errorDescription);
    return NextResponse.redirect(`${loginUrl}?${q}`);
  }
  if (!code) return NextResponse.redirect(`${loginUrl}?error=no_code`);

  return NextResponse.redirect(`${loginUrl}?code=${encodeURIComponent(code)}&from=kakao`);
}
