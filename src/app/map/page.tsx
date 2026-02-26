'use client';

import { useState, useEffect } from 'react';
import { Package, Store } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { MobileLayout, Header, BottomNav } from '@/components/layout';
import { Button, Badge } from '@/components/ui';
import KakaoMap from '@/components/map/KakaoMap';
import { formatDistance } from '@/mocks/stores';
import { mockTreasures, GRADE_CONFIG } from '@/mocks/treasures';
import { getStoreList } from '@/lib/api';
import type { Store as StoreType } from '@/types';
import styles from './page.module.scss';

type MarkerType = 'store' | 'treasure';

interface SelectedItem {
  type: MarkerType;
  data: StoreType | typeof mockTreasures[0];
}

export default function MapPage() {
  const router = useRouter();
  const [stores, setStores] = useState<StoreType[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [filter, setFilter] = useState<MarkerType | 'all'>('all');

  useEffect(() => {
    getStoreList().then(setStores);
  }, []);

  const handleMarkerClick = (type: MarkerType, data: StoreType | typeof mockTreasures[0]) => {
    setSelectedItem({ type, data });
  };

  const handleNavigate = () => {
    if (!selectedItem) return;
    
    if (selectedItem.type === 'store') {
      router.push(`/store/${(selectedItem.data as StoreType).id}`);
    } else {
      router.push('/treasure');
    }
  };

  return (
    <MobileLayout>
      <Header title="실시간 지도" showBack />
      
      <main className={styles.main}>
        {/* 필터 버튼 */}
        <div className={styles.filterBar}>
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            전체
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'store' ? styles.active : ''}`}
            onClick={() => setFilter('store')}
          >
            <Store size={16} />
            가맹점
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'treasure' ? styles.active : ''}`}
            onClick={() => setFilter('treasure')}
          >
            <Package size={16} />
            보물상자
          </button>
        </div>

        {/* 카카오맵 실시간 지도 */}
        <div className={`${styles.mapContainer} ${selectedItem ? styles.mapContainerWithSheet : ''}`}>
          <KakaoMap
            filter={filter}
            stores={stores}
            onMarkerClick={handleMarkerClick}
          />
        </div>

        {/* 선택된 아이템 바텀시트 */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              key={selectedItem.type + (selectedItem.data as { id?: string }).id}
              className={styles.bottomSheet}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <button 
                className={styles.closeBtn}
                onClick={() => setSelectedItem(null)}
              >
                <Image src="/images/ico_close_bk.svg" alt="닫기" width={16} height={16} />
              </button>

              {selectedItem.type === 'store' ? (
                // 가맹점 정보
                <div className={styles.sheetContent}>
                  <div className={styles.sheetIcon} />
                  <div className={styles.sheetInfo}>
                    <h3>{selectedItem.data.name}</h3>
                    <div className={styles.sheetMeta}>
                      <span className={styles.rating}>
                        <Image src="/images/ico_star.svg" alt="별점" width={16} height={16} />
                        {(selectedItem.data as StoreType).rating}
                      </span>
                      <span className={styles.distance}>
                        <Image src="/images/ico_map.svg" alt="위치" width={16} height={16} />
                        {formatDistance((selectedItem.data as StoreType).distance || 0)}
                      </span>
                    </div>
                    <Badge variant="primary" size="sm">
                      {(selectedItem.data as StoreType).benefit.description}
                    </Badge>
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleNavigate}
                    rightIcon={<Image src="/images/ico_arrow_right_wh_small.svg" alt="" width={16} height={16} />}
                  >
                    상세보기
                  </Button>
                </div>
              ) : (
                // 보물상자 정보
                <div className={styles.sheetContent}>
                  <div 
                    className={styles.sheetIcon}
                    style={{ backgroundColor: GRADE_CONFIG[(selectedItem.data as typeof mockTreasures[0]).grade].bgColor }}
                  />
                  <div className={styles.sheetInfo}>
                    <h3>{selectedItem.data.name}</h3>
                    <div className={styles.sheetMeta}>
                      <Badge variant={(selectedItem.data as typeof mockTreasures[0]).grade} size="sm">
                        {GRADE_CONFIG[(selectedItem.data as typeof mockTreasures[0]).grade].label} 등급
                      </Badge>
                      <span className={styles.distance}>
                        <Image src="/images/ico_map.svg" alt="위치" width={16} height={16} />
                        {(selectedItem.data as typeof mockTreasures[0]).distance}m
                      </span>
                    </div>
                    <p className={styles.treasureHint}>
                      망치 {(selectedItem.data as typeof mockTreasures[0]).requiredHits}회 필요
                    </p>
                  </div>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleNavigate}
                    rightIcon={<Image src="/images/ico_arrow_right_wh_small.svg" alt="" width={16} height={16} />}
                  >
                    열러가기
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
