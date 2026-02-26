/**
 * 카카오 OAuth Redirect URI.
 * ⚠️ 카카오 개발자 콘솔 [내 애플리케이션 → 카카오 로그인 → Redirect URI]에
 *    아래와 동일한 URL을 반드시 등록해야 함. (도메인/경로 한 글자라도 다르면 실패)
 */
export const KAKAO_CALLBACK_URL =
  process.env.NEXT_PUBLIC_KAKAO_CALLBACK_URL || 'https://sumtayo.co.kr/auth/kakao/callback.html';
export const APP_SCHEME = 'sumtayo';

/** sumtayo://kakao 로 앱이 켜졌을 때 code를 잃지 않도록 저장 (다른 페이지가 먼저 로드돼도 로그인에서 처리) */
export const PENDING_KAKAO_CODE_KEY = 'sumtayo_pending_kakao_code';

/** KakaoDeepLinkCapture가 code 받으면 dispatch하는 이벤트 (타이밍 이슈 방지) */
export const KAKAO_DEEPLINK_EVENT = 'kakao-deeplink-code';

/** 앱에서 needJoin 시 닉네임 페이지로 넘길 때 저장하는 키 */
export const PENDING_JOIN_STORAGE_KEY = 'sumtayo_pending_join';

export interface PendingJoinUser {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  image: string | null;
}

export function setPendingJoin(user: PendingJoinUser): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(PENDING_JOIN_STORAGE_KEY, JSON.stringify(user));
}

export function getPendingJoin(): PendingJoinUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(PENDING_JOIN_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingJoinUser;
    if (data?.provider && data?.providerId) return data;
    return null;
  } catch {
    return null;
  }
}

export function clearPendingJoin(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PENDING_JOIN_STORAGE_KEY);
}

/**
 * 카카오 공식 로그인(동의) 화면 URL.
 * 앱에서는 Browser.open()으로 이 URL을 열면 카카오 기본 로그인 화면이 뜬다.
 */
export function getKakaoAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '';
  if (!clientId) {
    throw new Error('NEXT_PUBLIC_KAKAO_CLIENT_ID가 필요합니다.');
  }
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: KAKAO_CALLBACK_URL,
    response_type: 'code',
  });
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

/** 토큰 교환 API 베이스 (앱에서 사용. Vercel 등 배포 URL 지정 시 여기 씀) */
function getApiBase(): string {
  if (typeof window === 'undefined') return '';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (appUrl) return appUrl;
  return window.location.origin;
}

/** 앱에서 code로 카카오 토큰·유저 받기 (우리 Next API 호출) */
export async function exchangeKakaoCode(code: string): Promise<{
  success: true;
  user: { id: string; name: string; email: string; profileImage: string | null };
} | { success: false; error: string }> {
  const base = getApiBase();
  const res = await fetch(`${base}/api/auth/kakao/mobile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirectUri: KAKAO_CALLBACK_URL }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, error: data?.error || '토큰 교환 실패' };
  }
  if (!data?.user) {
    return { success: false, error: '응답 형식 오류' };
  }
  return {
    success: true,
    user: {
      id: data.user.id,
      name: data.user.name || data.user.id,
      email: data.user.email || '',
      profileImage: data.user.profileImage ?? null,
    },
  };
}
