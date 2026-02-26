import type { Store, StoreCategory, StoreBenefit, Position } from '@/types';

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api-dev.sumtayo.kr').replace(/\/$/, '');
const TOKEN_KEY = 'sumtayo_access_token';

export function getAccessToken(): string | null {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}
export function setAccessToken(token: string): void {
  const t = typeof token === 'string' ? token.trim() : '';
  if (t && typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, t);
}
export function clearAccessToken(): void {
  if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY);
}

/** 공통: JWT 헤더 - Authorization에 토큰 그대로 */
function authHeaders(token: string | null): Record<string, string> {
  const t = typeof token === 'string' ? token.trim() : '';
  if (!t) return {};
  return { Authorization: t };
}

/** POST /app_user/user/join/sns - SNS 회원가입 (최초 1회) */
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
  const token =
    data.accessToken ??
    data.token ??
    data.jwt ??
    data.data?.accessToken ??
    data.data?.token ??
    data.data?.jwt;
  const tokenStr = typeof token === 'string' ? token.trim() : '';
  if (tokenStr) {
    return { success: true as const, accessToken: tokenStr, userId: data.userId, nickname: data.nickname };
  }
  return { success: true as const };
}

/** POST /app_user/user/login/sns - SNS 로그인 (가입자), needJoin 시 닉네임 페이지로 */
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
    data.jwt ??
    data.data?.accessToken ??
    data.data?.token ??
    data.data?.jwt;
  if (!token && typeof res.headers.get === 'function') {
    const authHeader = res.headers.get('Authorization') ?? res.headers.get('authorization');
    const xToken =
      res.headers.get('X-Access-Token') ??
      res.headers.get('x-access-token') ??
      res.headers.get('access-token');
    if (authHeader?.startsWith('Bearer ')) token = authHeader.slice(7);
    else if (xToken) token = xToken;
  }
  const tokenStr = typeof token === 'string' ? token.trim() : '';
  if (tokenStr) return { success: true as const, accessToken: tokenStr };
  // 200인데 토큰 없음 = 미가입 회원 → 회원가입(join) 필요
  return { success: false as const, needJoin: true };
}

/** GET /app_user/user/info - 내 정보 조회 (JWT) */
export interface UserInfo {
  nickname: string;
  userId: number;
  phone: string;
  email: string;
  profileImagePath: string;
}

export async function getUserInfo(): Promise<UserInfo | null> {
  const token = getAccessToken();
  if (!token) return null;
  const res = await fetch(`${BASE}/app_user/user/info`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  if (!data || typeof data !== 'object') return null;
  return {
    nickname: String(data.nickname ?? ''),
    userId: Number(data.userId) ?? 0,
    phone: String(data.phone ?? ''),
    email: String(data.email ?? ''),
    profileImagePath: String(data.profileImagePath ?? ''),
  };
}

/** GET /app_user/user/duplicate/nickname - 닉네임 중복 확인 */
export async function checkNicknameDuplicate(nickname: string): Promise<boolean> {
  const q = encodeURIComponent(nickname.trim());
  const res = await fetch(`${BASE}/app_user/user/duplicate/nickname?nickname=${q}`);
  const data = await res.json().catch(() => ({}));
  if (data && typeof data.isDuplicate === 'boolean') return data.isDuplicate;
  if (data && typeof data.duplicate === 'boolean') return data.duplicate;
  if (data && typeof data.available === 'boolean') return !data.available;
  return !res.ok;
}

/** PUT /app_user/user - 내 정보 수정 (JWT, nickname 필수, profileImagePath 선택) */
export async function updateUserProfile(params: { nickname: string; profileImagePath?: string }) {
  return apiRequest<{ success?: boolean }>('/app_user/user', {
    method: 'PUT',
    body: JSON.stringify({
      nickname: params.nickname,
      ...(params.profileImagePath !== undefined && params.profileImagePath !== '' && { profileImagePath: params.profileImagePath }),
    }),
  });
}

/** GET /app_user/store/list - 스토어 목록 조회 */

/** API에서 오는 스토어 한 건 (snake_case 허용) */
interface StoreListItem {
  id?: number | string;
  storeId?: number | string;
  name?: string;
  category?: string;
  address?: string;
  phone?: string;
  hours?: string;
  latitude?: number;
  lat?: number;
  longitude?: number;
  lng?: number;
  distance?: number;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  benefitType?: string;
  benefitDescription?: string;
  benefit_description?: string;
  benefit?: { type?: string; description?: string };
  images?: string[];
  imagePath?: string;
  [key: string]: unknown;
}

function mapStoreListItem(item: StoreListItem): Store {
  const id = String(item.id ?? item.storeId ?? '');
  const lat = item.latitude ?? item.lat ?? 0;
  const lng = item.longitude ?? item.lng ?? 0;
  const benefitDesc = item.benefit?.description ?? item.benefitDescription ?? item.benefit_description ?? '';
  const benefitType = (item.benefit?.type ?? item.benefitType ?? 'discount') as StoreBenefit['type'];
  const images = Array.isArray(item.images) ? item.images : item.imagePath ? [item.imagePath] : [];
  return {
    id,
    name: String(item.name ?? ''),
    category: (item.category as StoreCategory) ?? 'cafe',
    address: String(item.address ?? ''),
    phone: String(item.phone ?? ''),
    hours: String(item.hours ?? ''),
    position: { lat, lng } as Position,
    distance: typeof item.distance === 'number' ? item.distance : undefined,
    rating: Number(item.rating) || 0,
    reviewCount: Number(item.reviewCount ?? item.review_count) || 0,
    benefit: { type: benefitType, description: benefitDesc },
    images,
  };
}

export async function getStoreList(): Promise<Store[]> {
  try {
    const token = getAccessToken();
    const res = await fetch(`${BASE}/app_user/store/list`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
    });
    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    const rawList: StoreListItem[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.list)
        ? data.list
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.stores)
            ? data.stores
            : [];
    return rawList.map(mapStoreListItem);
  } catch {
    return [];
  }
}

/** 공통 API 요청 (JWT 자동 첨부) */
export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders(getAccessToken()),
    ...(options.headers as Record<string, string>),
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}
