'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './BottomNav.module.scss';

interface NavItem {
  path: string;
  iconPath: string;
  label: string;
}

const navItems: NavItem[] = [
  { path: '/', iconPath: '/images/ico_tab_home.svg', label: '홈' },
  { path: '/map', iconPath: '/images/ico_inactive_tab_map.svg', label: '지도' },
  { path: '/treasure', iconPath: '/images/ico_inactive_tab_treasure.svg', label: '보물상자' },
  { path: '/lotto', iconPath: '/images/ico_inactive_tab_ticket.svg', label: '로또' },
  { path: '/mypage', iconPath: '/images/ico_inactive_tab_mypage.svg', label: 'MY' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => {
        const active = isActive(item.path);
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.navItem} ${active ? styles.active : ''}`}
          >
            <span
              className={styles.navIcon}
              style={{ maskImage: `url(${item.iconPath})`, WebkitMaskImage: `url(${item.iconPath})` }}
            />
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
