'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout, Header } from '@/components/layout';
import { Button, Card } from '@/components/ui';
import styles from './page.module.scss';

export default function TicketRegisterPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 숫자/영문만 허용, 대문자 변환
    const cleaned = e.target.value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (cleaned.length <= 16) {
      setCode(cleaned);
      setError(null);
    }
  };

  const isCodeComplete = code.length === 16;

  const handleSubmit = async () => {
    if (!isCodeComplete) return;

    setIsLoading(true);
    setError(null);

    // 퍼블리싱 단계: 모의 API 호출
    setTimeout(() => {
      // 테스트용: 특정 코드 입력시 에러 표시
      if (code.startsWith('AAAA')) {
        setIsLoading(false);
        setError('이미 사용된 코드입니다.');
        return;
      }
      if (code.startsWith('BBBB')) {
        setIsLoading(false);
        setError('유효하지 않은 코드입니다.');
        return;
      }
      
      // 성공 시 완료 페이지로 이동
      router.push('/ticket/complete');
    }, 1500);
  };

  return (
    <MobileLayout hideBottomNav>
      <Header title="티켓 등록" showBack />
      
      <main className={styles.main}>
        <h2 className={styles.pageTitle}>
          홈쇼핑에서 등록한<br />
          코드를 입력해 주세요.
        </h2>

        <Card className={styles.inputCard}>
          <label className={styles.inputLabel}>쿠폰 코드</label>
          <input
            type="text"
            value={code}
            onChange={handleChange}
            maxLength={16}
            placeholder="쿠폰 코드를 입력해 주세요."
            className={styles.codeInput}
            autoComplete="off"
          />
          {error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <p className={styles.hint}>영문, 숫자 포함 16자리를 입력해 주세요.</p>
          )}
          
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            disabled={!isCodeComplete}
            loading={isLoading}
            className={styles.submitButton}
          >
            등록하기
          </Button>
        </Card>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>코드 확인 방법</h3>
          <Card className={styles.guideCard}>
            <ul className={styles.guideList}>
              <li>홈쇼핑 구매 완료 후 문자로 전송됩니다.</li>
              <li>'홈쇼핑 앱 &gt; 마이페이지 &gt; 쿠폰함'에서 확인하실 수 있습니다.</li>
              <li>코드 분실 시 고객센터로 문의하세요.</li>
            </ul>
          </Card>
        </section>
      </main>
    </MobileLayout>
  );
}
