'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, Button, Badge } from '@/components/ui';
import { TreasureSpot, Prize } from '@/types';
import { GRADE_CONFIG, mockPrizes } from '@/mocks/treasures';
import styles from './TreasureBox.module.scss';

interface TreasureBoxProps {
  spot: TreasureSpot;
  userHammers: number;
  onHammerUsed?: () => void;
}

const MEDAL_ICONS = {
  gold: '/images/ico_goldMedal_small.svg',
  silver: '/images/ico_silverMedal_small.svg',
  bronze: '/images/ico_bronzeMedal_small.svg',
};

const TREASURE_STEP_IMAGES: Record<'gold' | 'silver' | 'bronze', string[]> = {
  gold: [
    '/images/img_goldTreasure_step01.svg',
    '/images/img_goldTreasure_step02.svg',
    '/images/img_goldTreasure_step03.svg',
    '/images/img_goldTreasure_step04.svg',
  ],
  silver: [
    '/images/img_silverTreasure_step01.svg',
    '/images/img_silverTreasure_step02.svg',
    '/images/img_silverTreasure_step03.svg',
    '/images/img_silverTreasure_step04.svg',
  ],
  bronze: [
    '/images/img_bronzeTreasure_step01.svg',
    '/images/img_bronzeTreasure_step02.svg',
    '/images/img_bronzeTreasure_step03.svg',
    '/images/img_bronzeTreasure_step04.svg',
  ],
};

const HAMMER_IMAGE = '/images/img_hammer.png';

const getTreasureStep = (currentHits: number, isComplete: boolean) => {
  if (isComplete) return 3;
  return Math.min(currentHits, 3);
};

export default function TreasureBox({ spot, userHammers, onHammerUsed }: TreasureBoxProps) {
  const [isExpanded, setIsExpanded] = useState(spot.isActivated);
  const [currentHits, setCurrentHits] = useState(0);
  const [isHitting, setIsHitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [prize, setPrize] = useState<Prize | null>(null);

  const gradeConfig = GRADE_CONFIG[spot.grade];
  const isLocked = !spot.isActivated;
  const canHit = userHammers > 0 && !isLocked;
  const progress = currentHits / spot.requiredHits;
  const isComplete = currentHits >= spot.requiredHits;

  const step = getTreasureStep(currentHits, isComplete);
  const treasureImages = TREASURE_STEP_IMAGES[spot.grade];

  const handleHit = () => {
    if (!canHit || isHitting || isComplete) return;

    setIsHitting(true);
    
    setTimeout(() => {
      setCurrentHits((prev) => prev + 1);
      setIsHitting(false);
      onHammerUsed?.();

      if (currentHits + 1 >= spot.requiredHits) {
        setTimeout(() => {
          const randomPrize = mockPrizes[Math.floor(Math.random() * mockPrizes.length)];
          setPrize(randomPrize);
          setShowResult(true);
        }, 500);
      }
    }, 650);
  };

  return (
    <>
      <div 
        className={`${styles.container} ${isLocked ? styles.locked : ''}`}
        onClick={() => !isLocked && setIsExpanded(!isExpanded)}
      >
        {/* 헤더 영역 */}
        <div className={styles.header}>
          <div
            className={styles.iconWrapper}
            style={
              !isLocked
                ? {
                    backgroundColor: gradeConfig.bgColor,
                  }
                : undefined
            }
          >
            {isLocked ? (
              <Image src="/images/ico_lock.svg" alt="잠김" width={24} height={24} />
            ) : (
              <svg
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ color: gradeConfig.color }}
              >
                <path
                  d="M21.5 10.4118V6C21.5 4.34315 20.1569 3 18.5 3H5.5C3.84315 3 2.5 4.34315 2.5 6V10.4118M21.5 10.4118V18C21.5 19.6569 20.1569 21 18.5 21H5.5C3.84315 21 2.5 19.6569 2.5 18V10.4118M21.5 10.4118H13.8095M2.5 10.4118H10.1905"
                  stroke="currentColor"
                  strokeWidth={1.8}
                />
                <path
                  d="M10.375 8.98863H13.625C13.6802 8.98863 13.7246 9.03301 13.7246 9.08824V12.4564C13.7246 12.4965 13.7009 12.5325 13.6641 12.5482L12.0391 13.2406C12.0141 13.2512 11.9859 13.2512 11.9609 13.2406L10.3359 12.5482C10.2991 12.5325 10.2754 12.4965 10.2754 12.4564V9.08824C10.2754 9.03301 10.3198 8.98863 10.375 8.98863Z"
                  stroke="currentColor"
                  strokeWidth={1.8}
                />
              </svg>
            )}
          </div>
          
          <div className={styles.info}>
            <h3 className={styles.name}>{spot.name}</h3>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <Image src="/images/ico_map.svg" alt="" width={15} height={15} />
                {spot.distance}m
              </span>
              <span className={styles.metaItem}>
                <Image src="/images/ico_hammer_small.svg" alt="" width={15} height={15} />
                {spot.requiredHits}회
              </span>
            </div>
          </div>

          <Badge variant={spot.grade} size="sm">
            <Image 
              src={MEDAL_ICONS[spot.grade]} 
              alt={gradeConfig.label} 
              width={16} 
              height={16} 
            />
            {gradeConfig.label} 등급
          </Badge>
        </div>

        {/* 잠김 메시지 */}
        {isLocked && (
          <button className={styles.lockMessage}>해당 위치로 이동하세요</button>
        )}

        {/* 게임 영역 (활성화 시) */}
        <AnimatePresence>
          {isExpanded && !isLocked && (
            <motion.div
              className={styles.gameArea}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 보물상자 이미지 + 망치 */}
              <div className={styles.treasureWrapper}>
                <motion.div
                  className={styles.treasureImageWrap}
                  animate={isHitting ? { 
                    rotate: [-2, 2, 0],
                    scale: [0.98, 1.01, 1],
                  } : {}}
                  transition={{ duration: 0.15 }}
                >
                  <Image 
                    src={treasureImages[step]} 
                    alt="보물상자" 
                    width={180} 
                    height={130}
                    className={styles.treasureImage}
                  />
                </motion.div>
                {/* 망치 (두드릴 때: 상자 오른쪽 상단에서 왼쪽으로 스윙) */}
                <AnimatePresence>
                  {isHitting && (
                    <motion.div
                      className={styles.hammerWrap}
                      initial={{ opacity: 1, x: 0, rotate: 0 }}
                      animate={{ opacity: 0, x: -28, rotate: -22 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                    >
                      <Image src={HAMMER_IMAGE} alt="" width={144} height={144} className={styles.hammerImage} quality={95} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 진행바 */}
              <div className={styles.progressArea}>
                <div className={styles.progressBar}>
                  <motion.div 
                    className={styles.progressFill}
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className={styles.progressText}>
                  {currentHits}/{spot.requiredHits}
                </span>
              </div>

              {/* 액션 버튼 */}
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleHit}
                disabled={!canHit || isHitting || isComplete}
              >
                {isComplete 
                  ? '오픈 완료!' 
                  : isHitting 
                    ? '두드리는 중...' 
                    : `망치로 두드리기 (${userHammers}개 보유)`}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 결과 모달 */}
      <Modal
        isOpen={showResult}
        onClose={() => {
          setShowResult(false);
          setCurrentHits(0);
        }}
      >
        {prize && (
          <div className={styles.prizeResult}>
            <div className={styles.prizeIcon}>{prize.icon}</div>
            <h2 className={styles.prizeCongrats}>축하합니다!</h2>
            <h3 className={styles.prizeName}>{prize.name}</h3>
            <span
              className={styles.prizeBadge}
              style={{
                color: GRADE_CONFIG[prize.grade].color,
                backgroundColor: GRADE_CONFIG[prize.grade].bgColor,
              }}
            >
              {GRADE_CONFIG[prize.grade].label} 등급
            </span>
            <p className={styles.prizeDesc}>내 경품에 저장되었습니다.</p>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setShowResult(false);
                setCurrentHits(0);
              }}
            >
              확인
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
