'use client';

import { useState } from 'react';
import { Gift, Ticket, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { MobileLayout, Header, BottomNav } from '@/components/layout';
import { Card, Badge, Button, Modal, EmptyState } from '@/components/ui';
import { mockPrizes, GRADE_CONFIG } from '@/mocks/treasures';
import { Prize, PrizeStatus } from '@/types';
import styles from './page.module.scss';

const MEDAL_ICONS = {
  gold: '/images/ico_goldMedal_small.svg',
  silver: '/images/ico_silverMedal_small.svg',
  bronze: '/images/ico_bronzeMedal_small.svg',
};

type FilterTab = 'all' | PrizeStatus;

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'available', label: '사용가능' },
  { id: 'used', label: '사용완료' },
  { id: 'expired', label: '만료' },
];

export default function PrizesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredPrizes = mockPrizes.filter((prize) => {
    if (activeTab === 'all') return true;
    return prize.status === activeTab;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: PrizeStatus) => {
    switch (status) {
      case 'available':
        return <Badge variant="available" size="sm">사용가능</Badge>;
      case 'used':
        return <Badge variant="used" size="sm">사용완료</Badge>;
      case 'expired':
        return <Badge variant="expired" size="sm">만료</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  return (
    <MobileLayout>
      <Header title="내 경품" showBack />
      
      <main className={styles.main}>
        {/* 필터 탭 */}
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 경품 리스트 */}
        {filteredPrizes.length === 0 ? (
          <EmptyState
            icon={<Gift size={48} />}
            title="경품이 없습니다"
            description={activeTab === 'all' 
              ? "보물상자를 열어 경품을 획득해보세요!" 
              : `${tabs.find(t => t.id === activeTab)?.label} 경품이 없습니다.`
            }
          />
        ) : (
          <div className={styles.prizeList}>
            {filteredPrizes.map((prize) => (
              <Card
                key={prize.id}
                className={`${styles.prizeCard} ${prize.status !== 'available' ? styles.inactive : ''}`}
                hoverable={prize.status === 'available'}
                onClick={() => setSelectedPrize(prize)}
              >
                <div className={styles.prizeIcon} />
                <div className={styles.prizeInfo}>
                  <h3 className={styles.prizeName}>{prize.name}</h3>
                  <div className={styles.prizeMeta}>
                    <span className={styles.prizeDate}>
                      획득 : {formatDate(prize.obtainedAt)}
                    </span>
                    {getStatusBadge(prize.status)}
                  </div>
                </div>
                <Badge variant={prize.grade} size="sm">
                  <Image 
                    src={MEDAL_ICONS[prize.grade]} 
                    alt={GRADE_CONFIG[prize.grade].label} 
                    width={12} 
                    height={12} 
                  />
                  {GRADE_CONFIG[prize.grade].label} 등급
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* 경품 상세 모달 */}
      <Modal
        isOpen={!!selectedPrize}
        onClose={() => setSelectedPrize(null)}
        title="경품 상세"
      >
        {selectedPrize && (
          <div className={styles.prizeDetail}>
            <div className={styles.detailIcon}>{selectedPrize.icon}</div>
            <h3 className={styles.detailName}>{selectedPrize.name}</h3>
            
            <div className={styles.detailBadges}>
              <Badge variant={selectedPrize.grade}>
                {GRADE_CONFIG[selectedPrize.grade].label} 등급
              </Badge>
              {getStatusBadge(selectedPrize.status)}
            </div>

            <div className={styles.detailInfo}>
              {selectedPrize.value && (
                <div className={styles.detailRow}>
                  <span>가치</span>
                  <span>{selectedPrize.value.toLocaleString()}원</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span>획득일</span>
                <span>{new Date(selectedPrize.obtainedAt).toLocaleDateString('ko-KR')}</span>
              </div>
              {selectedPrize.expiresAt && (
                <div className={styles.detailRow}>
                  <span>만료일</span>
                  <span>{new Date(selectedPrize.expiresAt).toLocaleDateString('ko-KR')}</span>
                </div>
              )}
              {selectedPrize.usedAt && (
                <div className={styles.detailRow}>
                  <span>사용일</span>
                  <span>{new Date(selectedPrize.usedAt).toLocaleDateString('ko-KR')}</span>
                </div>
              )}
            </div>

            {selectedPrize.couponCode && selectedPrize.status === 'available' && (
              <div className={styles.couponSection}>
                <p className={styles.couponLabel}>쿠폰 코드</p>
                <div className={styles.couponCode}>
                  <span>{selectedPrize.couponCode}</span>
                  <button 
                    className={styles.copyButton}
                    onClick={() => handleCopyCode(selectedPrize.couponCode!)}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            )}

            {selectedPrize.status === 'available' && selectedPrize.type !== 'lotto' && (
              <Button variant="primary" fullWidth>
                사용하기
              </Button>
            )}
          </div>
        )}
      </Modal>

      <BottomNav />
    </MobileLayout>
  );
}
