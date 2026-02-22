'use client';

import { useState, useEffect } from 'react';
import styles from './AdBanner.module.scss';

const banners = [
  {
    id: 1,
    title: '흑돼지명가 돈사돈',
    subtitle: '4인 이상 방문 시 된장찌개 서비스 🍖',
    bgColor: '#D35400',
  },
  {
    id: 2,
    title: '카페 델문도 ☕',
    subtitle: '애월 오션뷰 | 아메리카노 1잔 무료',
    bgColor: '#2980B9',
  },
  {
    id: 3,
    title: '제주썬렌트카 🚗',
    subtitle: '전 차종 15% 할인 + 완전자차보험 무료',
    bgColor: '#27AE60',
  },
  {
    id: 4,
    title: '성산 해녀체험 🤿',
    subtitle: '해녀복 체험 + 해산물 시식 20% 할인',
    bgColor: '#8E44AD',
  },
];

export default function AdBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentBanner = banners[currentIndex];

  return (
    <div 
      className={styles.banner}
      style={{ backgroundColor: currentBanner.bgColor }}
    >
      <div className={styles.content}>
        <p className={styles.subtitle}>{currentBanner.subtitle}</p>
        <h2 className={styles.title}>{currentBanner.title}</h2>
      </div>
      <div className={styles.indicators}>
        {banners.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
