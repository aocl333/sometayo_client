'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MobileLayout, Header, BottomNav } from '@/components/layout';
import { Card } from '@/components/ui';
import { TreasureBox, GradeFilter } from '@/components/treasure';
import { mockTreasures } from '@/mocks/treasures';
import { mockUser } from '@/mocks/user';
import styles from './page.module.scss';

export default function TreasurePage() {
  const [hammers, setHammers] = useState(mockUser.stats.hammers);

  const handleHammerUsed = () => {
    setHammers((prev) => Math.max(0, prev - 1));
  };

  return (
    <MobileLayout>
      <Header title="보물상자" showBack />
      
      <main className={styles.main}>
        {/* 보유 망치 카드 */}
        <div className={styles.hammerSection}>
          <Card className={styles.hammerCard} padding="sm">
            <div className={styles.left}>
              <div className={styles.iconWrapper}>
                <Image src="/images/ico_hammer_wh.svg" alt="망치" width={24} height={24} />
              </div>
              <div className={styles.info}>
                <span className={styles.label}>보유 망치</span>
                <span className={styles.count}>{hammers}개</span>
              </div>
            </div>
          </Card>
        </div>

        <GradeFilter />

        {/* 보물상자 리스트 */}
        <section className={styles.treasureList}>
          <h2 className={styles.sectionTitle}>주변 보물상자</h2>
          {mockTreasures.map((spot) => (
            <TreasureBox
              key={spot.id}
              spot={spot}
              userHammers={hammers}
              onHammerUsed={handleHammerUsed}
            />
          ))}
        </section>
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
