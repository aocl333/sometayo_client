'use client';

import { ReactNode } from 'react';
import { BadgeVariant } from '@/types';
import styles from './Badge.module.scss';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
  ].join(' ');

  return (
    <span className={classNames}>
      {children}
    </span>
  );
}
