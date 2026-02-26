import { NextRequest, NextResponse } from 'next/server';

/** code → 카카오 토큰 교환 → 사용자 정보 반환 */
export async function POST(req: NextRequest) {
  try {
    const { code, redirectUri } = await req.json();
    if (!code || !redirectUri) {
      return NextResponse.json({ error: 'code, redirectUri 필수' }, { status: 400 });
    }

    const origin = req.headers.get('origin') ?? (() => {
      try { return new URL(req.headers.get('referer') ?? '').origin; } catch { return ''; }
    })();
    const base = (origin || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
    const redirectCandidates = base
      ? [redirectUri, `${base}/api/auth/kakao/callback`]
      : [redirectUri];

    let tokenRes: Response | null = null;
    let lastError = '';

    for (const uri of Array.from(new Set(redirectCandidates)).filter(Boolean)) {
      tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID!,
          redirect_uri: uri,
          code,
          client_secret: process.env.KAKAO_CLIENT_SECRET || 'kakao',
        }).toString(),
      });
      if (tokenRes.ok) break;
      lastError = await tokenRes.text();
    }

    if (!tokenRes?.ok) {
      console.error('Kakao token error:', lastError);
      return NextResponse.json({ error: '카카오 토큰 교환 실패' }, { status: 401 });
    }

    const { access_token: accessToken } = await tokenRes.json();
    const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!userRes.ok) {
      return NextResponse.json({ error: '카카오 사용자 정보 조회 실패' }, { status: 401 });
    }

    const kakaoUser = await userRes.json();
    const account = kakaoUser.kakao_account || {};
    const profile = account.profile || {};

    return NextResponse.json({
      success: true,
      user: {
        id: String(kakaoUser.id),
        kakaoId: String(kakaoUser.id),
        name: profile.nickname || `user_${kakaoUser.id}`,
        email: (account.email as string) || '',
        profileImage: profile.profile_image_url || null,
        accessToken,
      },
    });
  } catch (e) {
    console.error('Kakao mobile auth error:', e);
    return NextResponse.json({ error: '로그인 처리 중 오류' }, { status: 500 });
  }
}
