'use client';

import { ReactNode, HTMLAttributes } from 'react';
import styles from './Card.module.scss';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export default function Card({
  children,
  padding = 'md',
  hoverable = false,
  className = '',
  ...props
}: CardProps) {
  const classNames = [
    styles.card,
    styles[`padding-${padding}`],
    hoverable ? styles.hoverable : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
}
