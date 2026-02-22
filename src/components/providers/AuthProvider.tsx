'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider, useSession } from 'next-auth/react';
import { joinSns, loginSns, setAccessToken, clearAccessToken } from '@/lib/api';

interface AuthProviderProps {
  children: React.ReactNode;
}

/** NextAuth 세션 기준: 최초는 /app_user/join/sns, 이후 /app_user/login/sns 호출 후 JWT 저장 */
function BackendAuthSync() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const lastProviderId = useRef<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      clearAccessToken();
      lastProviderId.current = null;
      return;
    }
    if (status !== 'authenticated' || !session?.user) return;

    const { provider, providerId, email, name, image } = session.user;
    if (!provider || !providerId) return;
    if (lastProviderId.current === providerId) return;
    lastProviderId.current = providerId;

    (async () => {
      try {
        let result = await loginSns({
          provider,
          providerId,
          email: email ?? '',
        });

        if (!result.success && 'needJoin' in result && result.needJoin) {
          const joinOk = await joinSns({
            email: email ?? '',
            provider,
            providerId,
            nickname: name ?? email ?? 'user',
            phone: '01076494556', // 카카오 미제공. 임시 값
            profileImagePath: image ?? '',
          });
          if (joinOk.success && 'accessToken' in joinOk && joinOk.accessToken) {
            setAccessToken(joinOk.accessToken);
            return;
          }
          if (joinOk.success) {
            result = await loginSns({ provider, providerId, email: email ?? '' });
          }
        }

        if (result.success && 'accessToken' in result) {
          setAccessToken(result.accessToken);
          router.push('/');
        }
      } catch {
        // API 오류 시 무시 (토큰 미저장)
      }
    })();
  }, [session?.user?.providerId, session?.user?.email, session?.user?.name, session?.user?.image, status]);

  return null;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <BackendAuthSync />
      {children}
    </SessionProvider>
  );
}
