'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MessageSquare } from 'lucide-react';
import { MobileLayout, Header, BottomNav } from '@/components/layout';
import { Card, StarRating } from '@/components/ui';
import { mockStores, mockReviews } from '@/mocks/stores';
import styles from './page.module.scss';

export default function MyReviewsClient() {
  const router = useRouter();

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const myReviews = mockReviews.map((review) => ({
    ...review,
    userId: '',
  }));

  // 리뷰에 가맹점 정보 연결
  const reviewsWithStore = myReviews.map((review) => {
    const store = mockStores.find((s) => s.id === review.storeId);
    return { ...review, store };
  });

  return (
    <MobileLayout>
      <Header title="내 리뷰" showBack />

      <main className={styles.main}>
        {/* 리뷰 통계 */}
        <section className={styles.statsSection}>
          <div className={styles.statsCard}>
            <div className={styles.statsIconWrapper}>
              <Image
                src="/images/ico_review_wh.svg"
                alt="리뷰 아이콘"
                width={24}
                height={24}
                className={styles.statsIcon}
              />
            </div>
            <div className={styles.statsInfo}>
              <span className={styles.statsLabel}>작성한 리뷰</span>
              <span className={styles.statsValue}>{myReviews.length}개</span>
            </div>
          </div>
        </section>

        {/* 리뷰 목록 */}
        <section className={styles.reviewSection}>
          {reviewsWithStore.length > 0 ? (
            <div className={styles.reviewList}>
              {reviewsWithStore.map((review) => (
                <Card
                  key={review.id}
                  className={styles.reviewCard}
                  onClick={() => router.push(`/store/${review.storeId}`)}
                >
                  {/* 가맹점 정보 */}
                  <div className={styles.storeInfo}>
                    <div className={styles.storeImage}>
                      {review.store?.images && review.store.images.length > 0 ? (
                        <img src={review.store.images[0]} alt={review.store.name} />
                      ) : (
                        <div className={styles.storeImagePlaceholder} />
                      )}
                    </div>
                    <div className={styles.storeDetail}>
                      <span className={styles.storeName}>
                        {review.store?.name || '알 수 없는 가맹점'}
                      </span>
                      <span className={styles.storeAddress}>
                        {review.store?.address || ''}
                      </span>
                    </div>
                  </div>

                  {/* 리뷰 내용 */}
                  <div className={styles.reviewContent}>
                    <div className={styles.reviewRating}>
                      <StarRating rating={review.rating} size={14} />
                      <span className={styles.reviewDate}>
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <p className={styles.reviewText}>{review.content}</p>
                    {review.images && review.images.length > 0 && (
                      <div className={styles.reviewImages}>
                        {review.images.map((img, index) => (
                          <div key={index} className={styles.imageThumb}>
                            <img src={img} alt={`리뷰 이미지 ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <MessageSquare size={48} className={styles.emptyIcon} />
              <p className={styles.emptyText}>작성한 리뷰가 없습니다</p>
              <p className={styles.emptySubText}>
                가맹점을 방문하고 리뷰를 작성해보세요!
              </p>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
