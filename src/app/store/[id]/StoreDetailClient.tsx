'use client';

import { useRouter } from 'next/navigation';
import { Clock, ChevronRight } from 'lucide-react';
import { MobileLayout, Header } from '@/components/layout';
import { Button, Badge, Card } from '@/components/ui';
import { mockStores, mockReviews, getCategoryLabel } from '@/mocks/stores';
import styles from './page.module.scss';

interface StoreDetailClientProps {
  storeId: string;
}

export default function StoreDetailClient({ storeId }: StoreDetailClientProps) {
  const router = useRouter();
  
  const store = mockStores.find(s => s.id === storeId) || mockStores[0];
  const reviews = mockReviews.filter(r => r.storeId === storeId || r.storeId === 'store-001');

  return (
    <MobileLayout hideBottomNav>
      <Header showBack />
      
      <main className={styles.main}>
        {/* 헤더 이미지 */}
        <div className={styles.headerImage} />

        {/* 기본 정보 */}
        <section className={styles.basicInfo}>
          <div className={styles.titleRow}>
            <h1 className={styles.storeName}>{store.name}</h1>
            <Badge variant="primary" size="sm">{getCategoryLabel(store.category)}</Badge>
          </div>
          <div className={styles.rating}>
            <img src="/images/ico_star.svg" alt="" className={styles.starIcon} />
            <span className={styles.ratingValue}>{store.rating}</span>
            <span className={styles.reviewCount}>({store.reviewCount})</span>
          </div>
        </section>

        {/* 혜택 박스 */}
        <section className={styles.benefitSection}>
          <Card className={styles.benefitCard}>
            <div className={styles.iconWrapper}>
              <img src="/images/ico_present.svg" alt="" className={styles.benefitIcon} />
            </div>
            <div className={styles.benefitInfo}>
              <span className={styles.benefitLabel}>썸타요 혜택</span>
              <span className={styles.benefitDesc}>{store.benefit.description}</span>
            </div>
            <ChevronRight size={20} className={styles.benefitArrow} />
          </Card>
        </section>

        {/* 상세 정보 */}
        <section className={styles.detailSection}>
          <h2 className={styles.sectionTitle}>상세 정보</h2>
          <div className={styles.infoList}>
            <div className={styles.infoItem}>
              <img src="/images/ico_map.svg" alt="" className={styles.infoIcon} />
              <span>{store.address}</span>
            </div>
            <div className={styles.infoItem}>
              <img src="/images/ico_phone.svg" alt="" className={styles.infoIcon} />
              <span>{store.phone}</span>
            </div>
            <div className={styles.infoItem}>
                <img src="/images/ico_location.svg" alt="" className={styles.infoIcon} />
                <span>{store.hours}</span>
            </div>
          </div>
        </section>

        {/* 지도 미리보기 */}
        <section className={styles.mapSection}>
          <div className={styles.mapPreview} />
        </section>

        {/* 리뷰 섹션 */}
        <section className={styles.reviewSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>리뷰 {reviews.length}</h2>
            <button className={styles.viewAllBtn}>
              전체보기 <ChevronRight size={16} />
            </button>
          </div>

          <div className={styles.reviewList}>
            {reviews.slice(0, 3).map((review) => (
              <Card key={review.id} className={styles.reviewCard} padding="sm">
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewUser}>
                    <div className={styles.userAvatar} />
                    <span className={styles.userName}>{review.userName}</span>
                  </div>
                </div>
                <div className={styles.reviewMeta}>
                  <div className={styles.reviewRating}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <img
                        key={i}
                        src="/images/ico_star.svg"
                        alt=""
                        className={`${styles.reviewStar} ${i < review.rating ? styles.filled : styles.empty}`}
                      />
                    ))}
                  </div>
                  <span className={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className={styles.reviewContent}>{review.content}</p>
              </Card>
            ))}
          </div>
        </section>
      </main>

      {/* 하단 고정 버튼 */}
      <div className={styles.bottomActions}>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push(`/review/${store.id}`)}
        >
          리뷰 작성
        </Button>
        <Button
          variant="primary"
          size="lg"
          style={{ flex: 2 }}
        >
          QR 인증하기
        </Button>
      </div>
    </MobileLayout>
  );
}
