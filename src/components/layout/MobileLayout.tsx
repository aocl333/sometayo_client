'use client';

import { ReactNode } from 'react';
import styles from './MobileLayout.module.scss';

interface MobileLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export default function MobileLayout({ children, hideBottomNav = false }: MobileLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={`${styles.content} ${hideBottomNav ? '' : styles.withBottomNav}`}>
        {children}
      </div>
    </div>
  );
}
