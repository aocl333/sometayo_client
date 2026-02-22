'use client';

import Image from 'next/image';
import { GRADE_CONFIG } from '@/mocks/treasures';
import type { TreasureGrade } from '@/types';
import styles from './GradeFilter.module.scss';

const GRADES: TreasureGrade[] = ['gold', 'silver', 'bronze'];

export default function GradeFilter() {
  return (
    <div className={styles.container}>
      {GRADES.map((grade) => {
        const config = GRADE_CONFIG[grade];
        return (
          <button
            key={grade}
            type="button"
            className={`${styles.pill} ${styles[grade]}`}
          >
            <span className={styles.icon}>
              <Image src="/images/ico_medal.svg" alt={config.label} width={16} height={16} />
            </span>
            <span className={styles.text}>
              <span className={styles.label}>필요</span>
              <span className={styles.count}>{config.requiredHits}회</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
