const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-dev.sumtayo.kr').replace(/\/$/, '');
const TOKEN_KEY = 'sumtayo_access_token';

export function getAccessToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}
export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, token);
}
export function clearAccessToken(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

/** SNS 회원가입 (최초 1회) */
export async function joinSns(params: {
  email: string;
  provider: string;
  providerId: string;
  nickname: string;
  phone: string;
  profileImagePath?: string;
}) {
  const res = await fetch(`${BASE}/app_user/user/join/sns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: params.email,
      provider: params.provider,
      providerId: params.providerId,
      nickname: params.nickname,
      phone: params.phone,
      profileImagePath: params.profileImagePath ?? '',
    }),
  });
  if (!res.ok) return { success: false as const };
  const data = await res.json().catch(() => ({}));
  const token = data.accessToken ?? data.token;
  if (typeof token === 'string' && token) {
    return { success: true as const, accessToken: token, userId: data.userId, nickname: data.nickname };
  }
  return { success: true as const };
}

export async function loginSns(params: { provider: string; providerId: string; email: string }) {
  const res = await fetch(`${BASE}/app_user/user/login/sns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const status = res.status;
    const data = await res.json().catch(() => ({}));
    return { success: false as const, status, needJoin: status === 404 || data?.code === 'USER_NOT_FOUND' };
  }
  const data = await res.json().catch(() => ({}));
  let token =
    data.accessToken ??
    data.token ??
    data.data?.accessToken ??
    data.data?.token;
  if (!token && typeof res.headers.get === 'function') {
    const authHeader = res.headers.get('Authorization') ?? res.headers.get('authorization');
    const xToken =
      res.headers.get('X-Access-Token') ??
      res.headers.get('x-access-token') ??
      res.headers.get('access-token');
    if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7);
    else if (xToken) token = xToken;
  }
  const hasToken = typeof token === 'string' && token.length > 0;
  if (hasToken) return { success: true as const, accessToken: token };
  // 200인데 토큰 없음 = 미가입 회원 → 회원가입(join) 필요
  return { success: false as const, needJoin: true };
}

/** 프로필 이미지 업로드 - JWT 필요. 서버가 반환하는 profileImagePath 또는 url 사용 */
export async function uploadProfileImage(file: File): Promise<string> {
  const token = getAccessToken();
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${BASE}/app_user/profile-image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const data = await res.json();
  return (data.profileImagePath ?? data.url ?? data.path ?? '') as string;
}

/** 닉네임 중복 확인  */
export async function checkNicknameDuplicate(nickname: string): Promise<boolean> {
  const q = encodeURIComponent(nickname.trim());
  const res = await fetch(`${BASE}/app_user/duplicate/nickname?nickname=${q}`);
  const data = await res.json().catch(() => ({}));
  if (data && typeof data.duplicate === 'boolean') return data.duplicate;
  if (data && typeof data.available === 'boolean') return !data.available;
  return !res.ok;
}

/** 내 정보 수정 - JWT 필요. nickname 필수, profileImagePath 선택 */
export async function updateUserProfile(params: { nickname: string; profileImagePath?: string }) {
  return apiRequest<{ success?: boolean }>('/user/app_user', {
    method: 'PUT',
    body: JSON.stringify({
      nickname: params.nickname,
      ...(params.profileImagePath !== undefined && params.profileImagePath !== '' && { profileImagePath: params.profileImagePath }),
    }),
  });
}

/** 닉네임 등록/수정 후 결과 반환. 중복 시 duplicate: true */
export async function updateUserProfileWithResult(params: {
  nickname: string;
  profileImagePath?: string;
}): Promise<{ success: true } | { success: false; duplicate: boolean }> {
  const token = getAccessToken();
  const url = `${BASE}/user/app_user`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      nickname: params.nickname,
      ...(params.profileImagePath !== undefined && params.profileImagePath !== '' && { profileImagePath: params.profileImagePath }),
    }),
  });
  if (res.ok) return { success: true };
  const body = await res.json().catch(() => ({}));
  const msg = String(body?.message ?? body?.msg ?? '').toLowerCase();
  const code = String(body?.code ?? '').toLowerCase();
  const duplicate =
    res.status === 409 ||
    code.includes('nickname') ||
    code.includes('duplicate') ||
    msg.includes('이미 사용') ||
    msg.includes('중복');
  return { success: false, duplicate };
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string>) };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}
