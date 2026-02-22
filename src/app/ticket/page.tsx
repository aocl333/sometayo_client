'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { MobileLayout, Header, BottomNav } from '@/components/layout';
import { Card } from '@/components/ui';
import { mockUser } from '@/mocks/user';
import styles from './page.module.scss';

export default function TicketPage() {
  const router = useRouter();
  const ticket = mockUser.ticket;

  useEffect(() => {
    if (!ticket) {
      router.replace('/ticket/register');
    }
  }, [ticket, router]);

  if (!ticket) {
    return null;
  }

  return (
    <MobileLayout>
      <Header title="여행권" showBack />
      
      <main className={styles.main}>
        <Card className={styles.ticketCard}>
          {/* QR 코드 영역 */}
          <div className={styles.qrSection}>
            <div className={styles.qrCode}>
              <QRCodeSVG value={ticket.code} size={160} />
            </div>
            <p className={styles.qrHint}>가맹점에서 이 QR을 보여주세요</p>
          </div>

          {/* 티켓 정보 */}
          <div className={styles.ticketInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>티켓 코드</span>
              <span className={styles.infoValue}>{ticket.code}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>유효기간</span>
              <span className={styles.infoValue}>
                {new Date(ticket.expiresAt).toLocaleDateString('ko-KR')}까지
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>방문 횟수</span>
              <span className={styles.infoValue}>{ticket.visitCount}회</span>
            </div>
          </div>
        </Card>

        {/* 사용 현황 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>이용 현황</h3>
          <div className={styles.statsGrid}>
            <Card className={styles.statCard} padding="sm">
              <div className={styles.iconWrapper}>
                <Calendar size={24} />
              </div>
              <div className={styles.info}>
                <span className={styles.count}>{ticket.days}일권</span>
                <span className={styles.label}>이용 기간</span>
              </div>
            </Card>
            <Card className={styles.statCard} padding="sm">
              <div className={styles.iconWrapper}>
                <MapPin size={24} />
              </div>
              <div className={styles.info}>
                <span className={styles.count}>{ticket.visitCount}회</span>
                <span className={styles.label}>가맹점 방문</span>
              </div>
            </Card>
          </div>
        </section>

        {/* 안내 사항 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>이용 안내</h3>
          <Card className={styles.guideCard}>
            <ul className={styles.guideList}>
              <li>가맹점 방문 시 QR 코드를 직원에게 보여주세요.</li>
              <li>하루에 같은 가맹점은 1회만 인증 가능합니다.</li>
              <li>방문 인증 시 망치 또는 로또 번호를 획득합니다.</li>
              <li>유효기간이 지나면 사용할 수 없습니다.</li>
            </ul>
          </Card>
        </section>
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
