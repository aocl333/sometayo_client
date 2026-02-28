/** 앱 needJoin 시 닉네임 페이지로 넘길 때 저장 */
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
    return data?.provider && data?.providerId ? data : null;
  } catch {
    return null;
  }
}

export function clearPendingJoin(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(PENDING_JOIN_STORAGE_KEY);
}
