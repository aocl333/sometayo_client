'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui';
import styles from './HammerBar.module.scss';

export default function HammerBar() {
  const router = useRouter();
  const hammers = 0;

  return (
    <div className={styles.container}>
      <Card 
        className={styles.card}
        padding="sm"
        onClick={() => router.push('/treasure')}
      >
        <div className={styles.left}>
          <div className={styles.iconWrapper}>
            <img src="/images/ico_hammer.svg" alt="망치" className={styles.hammerIcon} />
          </div>
          <div className={styles.info}>
            <span className={styles.label}>보유 망치</span>
            <span className={styles.count}>{hammers}개</span>
          </div>
        </div>
        <button className={styles.button}>
          보물상자 열기 <ChevronRight size={16} />
        </button>
      </Card>
    </div>
  );
}
