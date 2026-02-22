'use client';

import { ReactNode } from 'react';
import { ChevronLeft, Bell, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Header.module.scss';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showLogo?: boolean;
  rightElement?: ReactNode;
  onBack?: () => void;
}

export default function Header({
  title,
  showBack = false,
  showLogo = false,
  rightElement,
  onBack,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.backButton} onClick={handleBack}>
            <ChevronLeft size={24} />
          </button>
        )}
        {showLogo && (
          <div className={styles.logo}>
            <img src="/images/logo_header.svg" alt="썸타요" className={styles.logoImage} />
          </div>
        )}
        {title && !showLogo && <h1 className={styles.title}>{title}</h1>}
      </div>

      <div className={styles.right}>
        {rightElement}
      </div>
    </header>
  );
}

// Pre-built header actions
export function TicketButton({ onClick }: { onClick?: () => void }) {
  const router = useRouter();
  return (
    <button
      className={styles.iconButton}
      onClick={onClick || (() => router.push('/ticket'))}
    >
      <Ticket size={24} />
    </button>
  );
}

export function NotificationButton({ onClick, hasNew }: { onClick?: () => void; hasNew?: boolean }) {
  return (
    <button className={styles.iconButton} onClick={onClick}>
      <Bell size={24} />
      {hasNew && <span className={styles.badge} />}
    </button>
  );
}
