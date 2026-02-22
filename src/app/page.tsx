'use client';

import { MobileLayout, Header, BottomNav, TicketButton, NotificationButton } from '@/components/layout';
import { AdBanner, LottoCard, HammerBar, StoreList } from '@/components/home';
import styles from './page.module.scss';

export default function HomePage() {
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
