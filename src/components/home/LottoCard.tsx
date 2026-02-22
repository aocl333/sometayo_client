'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui';
import { mockUser } from '@/mocks/user';
import { mockCurrentRound, mockUserLottos, getDaysUntilDraw, formatPrize } from '@/mocks/lotto';
import styles from './LottoCard.module.scss';

export default function LottoCard() {
  const router = useRouter();
  const daysUntil = getDaysUntilDraw(mockCurrentRound.drawDate);

  // 여러 장 중 첫 번째 미완성 티켓 또는 첫 번째 티켓 표시
  const currentTicket = mockUserLottos.find(t => !t.isComplete) || mockUserLottos[0];
  const completedCount = mockUserLottos.filter(t => t.isComplete).length;
  const totalCount = mockUserLottos.length;
  const filledCount = currentTicket.numbers.filter(n => n !== null).length;

  return (
    <div className={styles.container}>
      <Card className={styles.card} onClick={() => router.push('/lotto')}>
        <div className={styles.header}>
          <div className={styles.greeting}>
            <p className={styles.name}>{mockUser.name}님,</p>
            <p className={styles.message}>
              {completedCount === totalCount 
                ? `${totalCount}장 모두 완성! 🎉`
                : `${completedCount}/${totalCount}장 완성, ${6 - filledCount}개 더 필요해요`}
            </p>
          </div>
          <div className={styles.dday}>D-{daysUntil}</div>
        </div>

        <div className={styles.balls}>
          {currentTicket.numbers.map((num, idx) => (
            <div
              key={idx}
              className={`${styles.ball} ${num !== null ? styles.filled : styles.empty}`}
            >
              {num !== null ? num : '?'}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <span className={styles.prize}>
            당첨금: {formatPrize(mockCurrentRound.prize)}
          </span>
          <span className={styles.cta}>
            로또함 ({totalCount}장) <ChevronRight size={16} />
          </span>
        </div>
      </Card>
    </div>
  );
}
