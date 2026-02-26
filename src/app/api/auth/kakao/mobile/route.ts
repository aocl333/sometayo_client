import { NextRequest, NextResponse } from 'next/server';

/**
 * 모바일 앱용 카카오 OAuth 코드 → 토큰 교환
 * client_secret은 서버에만 보관
 */
export async function POST(req: NextRequest) {
  try {
    const { code, redirectUri } = await req.json();

    if (!code || !redirectUri) {
      return NextResponse.json(
        { error: 'code, redirectUri 필수' },
        { status: 400 }
      );
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID!,
      redirect_uri: redirectUri,
      code,
      client_secret: process.env.KAKAO_CLIENT_SECRET || 'kakao',
    });

    const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error('Kakao token error:', err);
      return NextResponse.json(
        { error: '카카오 토큰 교환 실패' },
        { status: 401 }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // 카카오 사용자 정보 조회
    const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userRes.ok) {
      return NextResponse.json(
        { error: '카카오 사용자 정보 조회 실패' },
        { status: 401 }
      );
    }

    const kakaoUser = await userRes.json();
    const account = kakaoUser.kakao_account || {};
    const profile = account.profile || {};

    const user = {
      id: String(kakaoUser.id),
      kakaoId: String(kakaoUser.id),
      name: profile.nickname || `user_${kakaoUser.id}`,
      email: (account.email as string) || '',
      profileImage: profile.profile_image_url || null,
      accessToken,
    };

    return NextResponse.json({ success: true, user });
  } catch (e) {
    console.error('Kakao mobile auth error:', e);
    return NextResponse.json(
      { error: '로그인 처리 중 오류' },
      { status: 500 }
    );
  }
}
