'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { APP_SCHEME, PENDING_KAKAO_CODE_KEY, KAKAO_DEEPLINK_EVENT } from '@/lib/kakao-auth';

/**
 * 앱이 sumtayo://kakao?code=... 로 켜졌을 때 code를 받아서
 * sessionStorage + 커스텀 이벤트로 전달. (getLaunchUrl 지연돼도 로그인 페이지가 이벤트로 처리)
 */
export default function KakaoDeepLinkCapture() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let removed = false;

    const saveCodeAndGoLogin = (url: string) => {
      if (!url.includes(`${APP_SCHEME}://kakao`)) return;
      try {
        const u = new URL(url);
        const code = u.searchParams.get('code');
        if (code) {
          sessionStorage.setItem(PENDING_KAKAO_CODE_KEY, code);
          window.dispatchEvent(new CustomEvent(KAKAO_DEEPLINK_EVENT, { detail: { code } }));
          if (!removed) router.replace('/login/');
        }
      } catch {
        // ignore
      }
    };

    (async () => {
      const app = await import('@capacitor/app').catch(() => null);
      if (!app?.App) return;

      const AppWithLaunch = app.App as typeof app.App & { getLaunchUrl?: () => Promise<{ url?: string }> };
      const readLaunchUrl = async (): Promise<string> => {
        const res = await AppWithLaunch.getLaunchUrl?.();
        return typeof res?.url === 'string' ? res.url : '';
      };

      // 즉시 한 번 + 지연 재시도 (Capacitor에서 getLaunchUrl이 늦게 채워지는 경우 대비)
      let url = await readLaunchUrl();
      if (!url) {
        await new Promise((r) => setTimeout(r, 400));
        url = await readLaunchUrl();
      }
      if (!url) {
        await new Promise((r) => setTimeout(r, 600));
        url = await readLaunchUrl();
      }
      if (url) saveCodeAndGoLogin(url);

      const cap = await import('@capacitor/core').catch(() => null);
      if (!cap?.Capacitor?.isNativePlatform?.()) return;

      const h = await app.App.addListener('appUrlOpen', (ev: { url: string }) => {
        if (ev?.url) saveCodeAndGoLogin(ev.url);
      });
      return () => {
        removed = true;
        h.remove();
      };
    })();
  }, [router]);

  return null;
}
