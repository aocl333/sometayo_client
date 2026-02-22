'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Camera, X, CheckCircle } from 'lucide-react';
import { MobileLayout, Header } from '@/components/layout';
import { Button, Card, Modal } from '@/components/ui';
import { mockStores } from '@/mocks/stores';
import styles from './page.module.scss';

interface ReviewClientProps {
  storeId: string;
}

export default function ReviewClient({ storeId }: ReviewClientProps) {
  const router = useRouter();
  
  const store = mockStores.find(s => s.id === storeId) || mockStores[0];

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = () => {
    if (images.length < 3) {
      setImages([...images, `https://picsum.photos/200?random=${images.length}`]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (rating === 0 || !content.trim()) return;

    setIsLoading(true);

    // 모의 제출
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
    }, 1500);
  };

  const isValid = rating > 0 && content.trim().length >= 10;

  return (
    <MobileLayout hideBottomNav>
      <Header title="리뷰 작성" showBack />
      
      <main className={styles.main}>
        {/* 가맹점 정보 */}
        <Card className={styles.storeCard}>
          <div className={styles.storeIcon}>🏪</div>
          <div className={styles.storeInfo}>
            <h2 className={styles.storeName}>{store.name}</h2>
            <p className={styles.storeAddress}>{store.address}</p>
          </div>
        </Card>

        {/* 별점 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>별점</h3>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={styles.starBtn}
                onClick={() => setRating(star)}
              >
                <Star
                  size={40}
                  fill={star <= rating ? '#FFD700' : 'none'}
                  color={star <= rating ? '#FFD700' : '#E0E0E0'}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
          <p className={styles.ratingText}>
            {rating === 0 && '별점을 선택해주세요'}
            {rating === 1 && '별로예요'}
            {rating === 2 && '그저 그래요'}
            {rating === 3 && '보통이에요'}
            {rating === 4 && '좋아요'}
            {rating === 5 && '최고예요!'}
          </p>
        </section>

        {/* 리뷰 내용 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>리뷰 내용</h3>
          <textarea
            className={styles.textarea}
            placeholder="방문 경험을 자세히 공유해주세요. (최소 10자)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          <p className={styles.charCount}>
            {content.length}자 {content.length < 10 && '(최소 10자)'}
          </p>
        </section>

        {/* 사진 첨부 */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>사진 첨부 (선택)</h3>
          <div className={styles.imageGrid}>
            {images.map((img, index) => (
              <div key={index} className={styles.imageItem}>
                <img src={img} alt={`리뷰 이미지 ${index + 1}`} />
                <button
                  className={styles.removeBtn}
                  onClick={() => handleRemoveImage(index)}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <button className={styles.addImageBtn} onClick={handleImageUpload}>
                <Camera size={24} />
                <span>{images.length}/3</span>
              </button>
            )}
          </div>
        </section>

        {/* 안내 */}
        <div className={styles.notice}>
          <p>🎁 리뷰 작성 시 망치 1개 또는 로또 번호 1개를 획득합니다!</p>
        </div>

        {/* 제출 버튼 */}
        <div className={styles.submitArea}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSubmit}
            disabled={!isValid}
            loading={isLoading}
          >
            리뷰 등록하기
          </Button>
        </div>
      </main>

      {/* 성공 모달 */}
      <Modal
        isOpen={showSuccess}
        onClose={() => {}}
        showClose={false}
      >
        <div className={styles.successModal}>
          <div className={styles.successIcon}>
            <CheckCircle size={64} />
          </div>
          <h3>리뷰가 등록되었습니다!</h3>
          <div className={styles.reward}>
            <span className={styles.rewardIcon}>🔨</span>
            <span>망치 1개를 획득했어요!</span>
          </div>
          <Button
            variant="primary"
            fullWidth
            onClick={() => router.push(`/store/${storeId}`)}
          >
            확인
          </Button>
        </div>
      </Modal>
    </MobileLayout>
  );
}
