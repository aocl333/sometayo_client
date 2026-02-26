'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/api';
import { MobileLayout, Header, BottomNav, TicketButton, NotificationButton } from '@/components/layout';
import { AdBanner, LottoCard, HammerBar, StoreList } from '@/components/home';
import styles from './page.module.scss';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!getAccessToken());
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated' && !getAccessToken()) router.replace('/login/');
  }, [status, router]);

  const isLoggedIn = status === 'authenticated' || hasToken;

  if (!isLoggedIn) return null;

  return (
    <MobileLayout>
      <Header
        showLogo
        rightElement={
          <>
            <TicketButton />
            <NotificationButton hasNew />
          </>
        }
      />
      
      <main className={styles.main}>
        <AdBanner />
        <LottoCard />
        <HammerBar />
        <StoreList />
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
