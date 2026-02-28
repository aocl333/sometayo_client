'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/** 앱이 sumtayo://auth/kakao/callback?... 로 열렸을 때 쿼리 그대로 /auth/kakao/callback 로 전달 */
export default function AppUrlOpenHandler() {
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const listener = App.addListener('appUrlOpen', ({ url }) => {
      try {
        if (!url.includes('/auth/kakao/callback')) return;
        const u = new URL(url);
        const qs = u.searchParams.toString();
        if (qs) router.push(`/auth/kakao/callback?${qs}`);
      } catch {
        // ignore
      }
    });

    return () => {
      listener.then((l) => l.remove());
    };
  }, [router]);

  return null;
}
