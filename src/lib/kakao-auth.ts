/**
 * 카카오 로그인 (앱: 네이티브 플러그인 / 웹·로컬: Redirect URI + code 교환)
 */

/** 웹·로컬 Redirect URI (카카오 개발자 콘솔에 등록). 동일 origin 기준 */
export function getKakaoCallbackUrl(): string {
  if (typeof window === 'undefined') return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || '';
  return `${window.location.origin}/api/auth/kakao/callback`;
}

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

/** 웹·로컬: 카카오 로그인 URL (리다이렉트용) */
export function getKakaoAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID || '';
  if (!clientId) throw new Error('NEXT_PUBLIC_KAKAO_CLIENT_ID가 필요합니다.');
  const redirectUri = typeof window !== 'undefined' ? getKakaoCallbackUrl() : '';
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
  });
  return `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
}

function getApiBase(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin;
}

/** 웹·로컬: code로 카카오 토큰·유저 조회 후 우리 API 호출. redirectUriOverride는 callback.html 등 다른 콜백 URL 쓸 때 전달 */
export async function exchangeKakaoCode(
  code: string,
  redirectUriOverride?: string
): Promise<
  | { success: true; user: { id: string; name: string; email: string; profileImage: string | null } }
  | { success: false; error: string }
> {
  const redirectUri =
    redirectUriOverride ?? (typeof window !== 'undefined' ? getKakaoCallbackUrl() : '');
  const base = getApiBase();
  const res = await fetch(`${base}/api/auth/kakao/mobile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirectUri }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return { success: false, error: data?.error || '토큰 교환 실패' };
  if (!data?.user) return { success: false, error: '응답 형식 오류' };
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
