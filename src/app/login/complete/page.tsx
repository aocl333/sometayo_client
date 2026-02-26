'use client';

import { MobileLayout } from '@/components/layout';
import styles from './page.module.scss';

/** 카카오 로그인 후 잠시 머무는 페이지. AuthProvider가 login/join 판별 후 메인 또는 닉네임으로 보냄 */
export default function LoginCompletePage() {
  return (
    <MobileLayout hideBottomNav>
      <div className={styles.container}>
        <p className={styles.text}>로그인 중...</p>
      </div>
    </MobileLayout>
  );
}
