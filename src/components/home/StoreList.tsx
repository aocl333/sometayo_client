'use client';

import { useRouter } from 'next/navigation';
import { Card, Badge } from '@/components/ui';
import { mockStores, formatDistance } from '@/mocks/stores';
import styles from './StoreList.module.scss';

export default function StoreList() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>내 주변 가맹점</h2>
        <button 
          className={styles.viewAll}
          onClick={() => router.push('/map')}
        >
          전체보기
        </button>
      </div>

      <div className={styles.list}>
        {mockStores.slice(0, 5).map((store) => (
          <Card
            key={store.id}
            className={styles.storeCard}
            padding="sm"
            hoverable
            onClick={() => router.push(`/store/${store.id}`)}
          >
            <div className={styles.storeInfo}>
              <div className={styles.storeImageWrap} />
              <div className={styles.details}>
                <h3 className={styles.storeName}>{store.name}</h3>
                <div className={styles.meta}>
                  <span className={styles.rating}>
                    <img src="/images/ico_star.svg" alt="" className={styles.starIcon} />
                    {store.rating}
                  </span>
                  <span className={styles.distance}>
                    <img src="/images/ico_map.svg" alt="" className={styles.mapIcon} />
                    {formatDistance(store.distance || 0)}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.badgeWrap}>
              <Badge variant="primary" size="sm">
                {store.benefit.description}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
