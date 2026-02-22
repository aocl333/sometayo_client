'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MobileLayout, Header } from '@/components/layout';
import { Button } from '@/components/ui';
import styles from './page.module.scss';

export default function TicketCompletePage() {
  const router = useRouter();

  // TODO: 실제 데이터는 API 또는 상태관리에서 가져오기
  const ticketInfo = {
    vendor: '현대 홈쇼핑',
    name: '로또 패키지 (3일권)',
    startDate: '2026.01.30',
    endDate: '2026.02.02',
  };

  return (
    <MobileLayout hideBottomNav>
      <Header title="티켓 등록" showBack />
      
      <main className={styles.main}>
        <div className={styles.content}>
          {/* 성공 아이콘 */}
          <div className={styles.iconWrapper}>
            <Image 
              src="/images/ico_completed.svg" 
              alt="완료" 
              width={48} 
              height={48} 
            />
          </div>

          {/* 완료 메시지 */}
          <h2 className={styles.title}>등록 완료!</h2>
          <p className={styles.description}>여행권이 성공적으로 등록되었습니다.</p>

          {/* 티켓 정보 카드 */}
          <div className={styles.ticketCard}>
            <span className={styles.vendor}>{ticketInfo.vendor}</span>
            <h3 className={styles.ticketName}>{ticketInfo.name}</h3>
            <div className={styles.dateRow}>
              <span>시작 : {ticketInfo.startDate}</span>
              <span>만료 : {ticketInfo.endDate}</span>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={styles.bottomButton}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => router.push('/')}
          >
            홈으로 가기
          </Button>
        </div>
      </main>
    </MobileLayout>
  );
}
