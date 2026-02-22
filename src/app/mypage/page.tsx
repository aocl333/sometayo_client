'use client';

import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { MobileLayout, Header, BottomNav } from '@/components/layout';
import { Card } from '@/components/ui';
import { mockUser } from '@/mocks/user';
import styles from './page.module.scss';

interface MenuItem {
  icon: string;
  label: string;
  path?: string;
  onClick?: () => void;
  badge?: string;
}

export default function MyPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { stats } = mockUser;
  
  // 로그인한 사용자 이름 (카카오 닉네임 또는 기본값)
  const userName = session?.user?.name || mockUser.name;

  const travelMenus: MenuItem[] = [
    { icon: '/images/ico_flight_bk.svg', label: '여행권', path: '/ticket' },
    { icon: '/images/ico_treasure_bk.svg', label: '보물상자', path: '/treasure' },
    { icon: '/images/ico_present_bk.svg', label: '내 경품', path: '/prizes', badge: `${stats.prizesCount}` },
    { icon: '/images/ico_ticket_bk.svg', label: '로또함', path: '/lotto' },
    { icon: '/images/ico_review_bk.svg', label: '내 리뷰', path: '/mypage/reviews', badge: `${stats.reviewsCount}` },
  ];

  const handleMenuClick = (menu: MenuItem) => {
    if (menu.onClick) {
      menu.onClick();
    } else if (menu.path) {
      router.push(menu.path);
    }
  };

  return (
    <MobileLayout>
      <Header title="마이페이지" />
      
      <main className={styles.main}>
        {/* 프로필 섹션 */}
        <section className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.avatar}>
              {session?.user?.image ? (
                <img src={session.user.image} alt="프로필" />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.userName}>{userName}</h2>
              <button className={styles.profileBtn}>
                프로필 보기 <Image src="/images/ico_arrow_right_gr.svg" alt="" width={15} height={15} />
              </button>
            </div>
          </div>
        </section>

        {/* 활동 요약 */}
        <section className={styles.statsSection}>
          <div className={styles.statsCard}>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.statIcon}>
                    <g clipPath="url(#clip0_38_912)">
                      <path d="M17.8556 4.29427L18.4721 3.84659C18.6634 3.70763 18.8951 3.63916 19.1258 3.65338C19.3566 3.66761 19.5715 3.76361 19.7322 3.92427C19.8928 4.08493 19.9888 4.29981 20.003 4.53059C20.0173 4.76137 19.9488 4.99305 19.8098 5.18433L19.3622 5.80083L23.6346 10.0733C23.806 10.2446 23.8994 10.4799 23.8944 10.7272C23.8893 10.9746 23.7862 11.2138 23.6077 11.3923L19.8544 15.1456C19.482 15.518 18.892 15.5291 18.5354 15.1725L15.3397 11.9768L6.87967 21.3636C6.62014 21.6517 6.30674 21.8863 5.95861 22.053C5.61048 22.2197 5.2349 22.315 4.85479 22.3332C4.47468 22.3514 4.09801 22.2921 3.74774 22.1588C3.39748 22.0256 3.08097 21.8212 2.81752 21.5582L2.09912 20.8398C1.83589 20.5764 1.63133 20.2599 1.49792 19.9096C1.36451 19.5592 1.30505 19.1825 1.32317 18.8023C1.34129 18.4221 1.43662 18.0464 1.60333 17.6981C1.77003 17.3499 2.00463 17.0364 2.29279 16.7768L11.6796 8.31676L8.4839 5.12102C8.31256 4.94968 8.21913 4.71445 8.22418 4.46709C8.22923 4.21973 8.33234 3.9805 8.51082 3.80202L8.67502 3.63782C9.80508 2.50776 11.3197 1.8548 12.8859 1.8225C14.4521 1.79021 15.9416 2.38123 17.0269 3.46561L17.8556 4.29427ZM12.9734 9.61056L3.50961 18.1389C3.41357 18.2256 3.33543 18.3302 3.27996 18.4464C3.22449 18.5626 3.19285 18.688 3.18697 18.8148C3.18109 18.9416 3.2011 19.0672 3.24577 19.1839C3.29045 19.3007 3.35885 19.4061 3.44679 19.4938L4.16433 20.2114C4.25212 20.2989 4.35755 20.367 4.47421 20.4113C4.59087 20.4557 4.71632 20.4754 4.84292 20.4694C4.96951 20.4634 5.09461 20.4317 5.21058 20.3762C5.32655 20.3207 5.43098 20.2427 5.5175 20.1468L14.0467 10.6839L12.9734 9.61056ZM10.5172 4.46249L19.2362 13.1814L21.6435 10.774L15.6819 4.81239C15.0241 4.15467 14.1461 3.75922 13.2019 3.69539C12.2576 3.63157 11.3066 3.90259 10.5172 4.46249Z" fill="currentColor"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_38_912">
                        <rect width="24" height="24" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <span className={styles.statValue}>{stats.hammers}</span>
                <span className={styles.statLabel}>망치</span>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.statIcon}>
                    <path d="M11.2483 4.0917C11.111 3.96817 10.9337 3.89993 10.75 3.8999H4.75C4.15326 3.8999 3.58097 4.13978 3.15901 4.56676C2.73705 4.99374 2.5 5.57285 2.5 6.17669V13.766C2.5 14.3698 2.73705 14.9489 3.15901 15.3759C3.58097 15.8029 4.15326 16.0428 4.75 16.0428H10.75C10.9489 16.0428 11.1397 15.9628 11.2803 15.8205C11.421 15.6781 11.5 15.4851 11.5 15.2838L11.5052 15.195C11.5278 15.003 11.622 14.8268 11.7686 14.7027C11.9152 14.5785 12.1031 14.5157 12.294 14.527C12.4848 14.5384 12.6641 14.623 12.7954 14.7637C12.9266 14.9043 12.9998 15.0904 13 15.2838L13.0052 15.3726C13.0267 15.5572 13.1144 15.7274 13.2517 15.851C13.389 15.9745 13.5663 16.0427 13.75 16.0428H15.25C15.8467 16.0428 16.419 15.8029 16.841 15.3759C17.2629 14.9489 17.5 14.3698 17.5 13.766V6.17669C17.5 5.57285 17.2629 4.99374 16.841 4.56676C16.419 4.13978 15.8467 3.8999 15.25 3.8999H13.75C13.5511 3.8999 13.3603 3.97986 13.2197 4.12219C13.079 4.26451 13 4.45755 13 4.65883L12.9948 4.74763C12.9722 4.93971 12.878 5.11582 12.7314 5.23997C12.5848 5.36412 12.3969 5.42695 12.206 5.41561C12.0152 5.40428 11.8359 5.31963 11.7046 5.17898C11.5734 5.03832 11.5002 4.85227 11.5 4.65883L11.4948 4.57004C11.4733 4.38543 11.3856 4.21522 11.2483 4.0917Z" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M12.1428 7.47119L12.1428 8.89976" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12.1429 11.0425L12.1429 12.4711" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className={styles.statValue}>
                  {stats.lottoNumbers.filter(n => n !== null).length}/6
                </span>
                <span className={styles.statLabel}>로또</span>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.statIcon}>
                    <path d="M17.5758 10V16C17.5758 16.3978 17.4161 16.7794 17.132 17.0607C16.8478 17.342 16.4624 17.5 16.0606 17.5H3.93939C3.53755 17.5 3.15217 17.342 2.86802 17.0607C2.58387 16.7794 2.42424 16.3978 2.42424 16V10C2.22332 10 2.03063 9.92098 1.88855 9.78033C1.74648 9.63968 1.66667 9.44891 1.66667 9.25V7C1.66667 6.60218 1.8263 6.22064 2.11044 5.93934C2.39459 5.65804 2.77997 5.5 3.18182 5.5H5.58333C5.49771 5.25905 5.45416 5.00542 5.45454 4.75C5.45454 4.15326 5.69399 3.58097 6.12021 3.15901C6.54643 2.73705 7.12451 2.5 7.72727 2.5C8.48485 2.5 9.15151 2.875 9.56818 3.43V3.4225L10 4L10.4318 3.4225V3.43C10.8485 2.875 11.5152 2.5 12.2727 2.5C12.8755 2.5 13.4536 2.73705 13.8798 3.15901C14.306 3.58097 14.5455 4.15326 14.5455 4.75C14.5458 5.00542 14.5023 5.25905 14.4167 5.5H16.8182C17.22 5.5 17.6054 5.65804 17.8896 5.93934C18.1737 6.22064 18.3333 6.60218 18.3333 7V9.25C18.3333 9.44891 18.2535 9.63968 18.1114 9.78033C17.9694 9.92098 17.7767 10 17.5758 10ZM3.93939 16H9.24242V10H3.93939V16ZM16.0606 16V10H10.7576V16H16.0606ZM7.72727 4C7.52635 4 7.33366 4.07902 7.19159 4.21967C7.04951 4.36032 6.9697 4.55109 6.9697 4.75C6.9697 4.94891 7.04951 5.13968 7.19159 5.28033C7.33366 5.42098 7.52635 5.5 7.72727 5.5C7.92819 5.5 8.12089 5.42098 8.26296 5.28033C8.40503 5.13968 8.48485 4.94891 8.48485 4.75C8.48485 4.55109 8.40503 4.36032 8.26296 4.21967C8.12089 4.07902 7.92819 4 7.72727 4ZM12.2727 4C12.0718 4 11.8791 4.07902 11.737 4.21967C11.595 4.36032 11.5152 4.55109 11.5152 4.75C11.5152 4.94891 11.595 5.13968 11.737 5.28033C11.8791 5.42098 12.0718 5.5 12.2727 5.5C12.4736 5.5 12.6663 5.42098 12.8084 5.28033C12.9505 5.13968 13.0303 4.94891 13.0303 4.75C13.0303 4.55109 12.9505 4.36032 12.8084 4.21967C12.6663 4.07902 12.4736 4 12.2727 4ZM3.18182 7V8.5H9.24242V7H3.18182ZM10.7576 7V8.5H16.8182V7H10.7576Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className={styles.statValue}>{stats.prizesCount}</span>
                <span className={styles.statLabel}>경품</span>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statIconWrapper}>
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.statIcon}>
                    <path d="M16 3.3335H4C3.175 3.3335 2.5 4.0085 2.5 4.8335V15.9193C2.5 16.8102 3.57714 17.2564 4.20711 16.6264L5.20711 15.6264C5.39464 15.4389 5.649 15.3335 5.91421 15.3335H16C16.825 15.3335 17.5 14.6585 17.5 13.8335V4.8335C17.5 4.0085 16.825 3.3335 16 3.3335ZM16 12.8335C16 13.3858 15.5523 13.8335 15 13.8335H5.05924C4.94287 13.8335 4.83127 13.8797 4.74899 13.962C4.4726 14.2384 4 14.0426 4 13.6518V5.8335C4 5.28121 4.44772 4.8335 5 4.8335H15C15.5523 4.8335 16 5.28121 16 5.8335V12.8335Z" fill="currentColor"/>
                    <path d="M10 11.1531L11.4977 12.1009C11.772 12.2746 12.1077 12.0179 12.0355 11.6931L11.6385 9.91067L12.963 8.7098C13.2048 8.49077 13.0749 8.07538 12.7573 8.04895L11.0141 7.89412L10.332 6.20988C10.2093 5.904 9.79068 5.904 9.66797 6.20988L8.98586 7.89034L7.2427 8.04517C6.9251 8.0716 6.79518 8.487 7.03698 8.70602L8.3615 9.90689L7.9645 11.6893C7.89232 12.0141 8.22796 12.2709 8.50225 12.0972L10 11.1531Z" fill="currentColor"/>
                  </svg>
                </div>
                <span className={styles.statValue}>{stats.reviewsCount}</span>
                <span className={styles.statLabel}>리뷰</span>
              </div>
            </div>
          </div>
        </section>

        {/* 메뉴 그룹 */}
        <section className={styles.menuSection}>
          <h3 className={styles.menuTitle}>나의 여행</h3>
          <Card className={styles.menuCard} padding="none">
            {travelMenus.map((menu, index) => (
              <button
                key={index}
                className={styles.menuItem}
                onClick={() => handleMenuClick(menu)}
              >
                <div className={styles.menuLeft}>
                  <Image src={menu.icon} alt={menu.label} width={20} height={20} />
                  <span>{menu.label}</span>
                </div>
                <div className={styles.menuRight}>
                  {menu.badge && <span className={styles.menuBadge}>{menu.badge}</span>}
                  <Image src="/images/ico_arrow_right_gr.svg" alt="" width={18} height={18} className={styles.menuArrow} />
                </div>
              </button>
            ))}
          </Card>
        </section>

        {/* 로그아웃 */}
        <section className={styles.menuSection}>
          <Card className={styles.menuCard} padding="none">
            <button
              className={`${styles.menuItem} ${styles.logout}`}
              onClick={() => {
                signOut({ redirect: false }).then(() => router.push('/login'));
              }}
            >
              <div className={styles.menuLeft}>
                <Image src="/images/ico_logout_bk.svg" alt="로그아웃" width={20} height={20} />
                <span>로그아웃</span>
              </div>
              <Image src="/images/ico_arrow_right_gr.svg" alt="" width={18} height={18} className={styles.menuArrow} />
            </button>
          </Card>
        </section>
      </main>

      <BottomNav />
    </MobileLayout>
  );
}
