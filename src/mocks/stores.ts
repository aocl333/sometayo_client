import { Store, Review } from '@/types';

// 테스트용: 부산 해운대구 하삼동 양운점 (현재위치 테스트 시 이 마커만 지도에 표시)
export const TEST_STORE_ID = 'store-yangwoon';

export const mockStores: Store[] = [
  {
    id: 'store-yangwoon',
    name: '하삼동 양운점',
    category: 'cafe',
    address: '부산광역시 해운대구 하삼동',
    phone: '051-702-0000',
    hours: '10:00 - 21:00',
    position: { lat: 35.173782, lng: 129.1676445 },
    distance: 420,
    rating: 4.5,
    reviewCount: 0,
    benefit: {
      type: 'discount',
      description: '테스트 관광지',
    },
    images: ['/images/stores/store1.jpg'],
  },
  {
    id: 'store-001',
    name: '올레국수',
    category: 'restaurant',
    address: '제주시 연동 312-24',
    phone: '064-123-4567',
    hours: '10:00 - 21:00',
    position: { lat: 33.4996, lng: 126.5312 },
    distance: 350,
    rating: 4.5,
    reviewCount: 128,
    benefit: {
      type: 'discount',
      description: '국수 1,000원 할인',
    },
    images: ['/images/stores/store1.jpg'],
  },
  {
    id: 'store-002',
    name: '카페 바다',
    category: 'cafe',
    address: '제주시 애월읍 해안로 123',
    phone: '064-234-5678',
    hours: '09:00 - 22:00',
    position: { lat: 33.4632, lng: 126.3089 },
    distance: 1200,
    rating: 4.8,
    reviewCount: 256,
    benefit: {
      type: 'free',
      description: '음료 1잔 무료',
    },
    images: ['/images/stores/store2.jpg'],
  },
  {
    id: 'store-003',
    name: '제주 흑돼지 맛집',
    category: 'restaurant',
    address: '서귀포시 중문동 456-78',
    phone: '064-345-6789',
    hours: '11:00 - 22:00',
    position: { lat: 33.2541, lng: 126.4125 },
    distance: 2500,
    rating: 4.7,
    reviewCount: 89,
    benefit: {
      type: 'conditional',
      description: '4인 이상 시 음료 서비스',
    },
    images: ['/images/stores/store3.jpg'],
  },
  {
    id: 'store-004',
    name: '감귤농장 체험',
    category: 'activity',
    address: '서귀포시 남원읍 감귤로 55',
    phone: '064-456-7890',
    hours: '10:00 - 17:00',
    position: { lat: 33.2789, lng: 126.7012 },
    distance: 4800,
    rating: 4.3,
    reviewCount: 45,
    benefit: {
      type: 'discount',
      description: '체험비 20% 할인',
    },
    images: ['/images/stores/store4.jpg'],
  },
  {
    id: 'store-005',
    name: '제주 게스트하우스',
    category: 'accommodation',
    address: '제주시 삼도동 789-12',
    phone: '064-567-8901',
    hours: '체크인 15:00 / 체크아웃 11:00',
    position: { lat: 33.5097, lng: 126.5219 },
    distance: 800,
    rating: 4.6,
    reviewCount: 167,
    benefit: {
      type: 'discount',
      description: '숙박비 10% 할인',
    },
    images: ['/images/stores/store5.jpg'],
  },
];

export const mockReviews: Review[] = [
  {
    id: 'review-001',
    userId: 'user-001',
    userName: '제주러버',
    storeId: 'store-001',
    rating: 5,
    content: '국수가 정말 맛있어요! 육수가 진하고 면발도 쫄깃해요. 다음에 또 방문할게요.',
    images: ['/images/reviews/review1.jpg'],
    createdAt: '2026-01-25T14:30:00Z',
    status: 'approved',
  },
  {
    id: 'review-002',
    userId: 'user-002',
    userName: '맛집헌터',
    storeId: 'store-001',
    rating: 4,
    content: '가성비 좋은 국수집입니다. 양도 많고 맛도 좋아요.',
    createdAt: '2026-01-20T11:00:00Z',
    status: 'approved',
  },
  {
    id: 'review-003',
    userId: 'user-003',
    userName: '여행자A',
    storeId: 'store-002',
    rating: 5,
    content: '바다 뷰가 환상적이에요. 커피도 맛있고 분위기도 최고!',
    images: ['/images/reviews/review2.jpg', '/images/reviews/review3.jpg'],
    createdAt: '2026-01-28T16:45:00Z',
    status: 'approved',
  },
];

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    restaurant: '음식점',
    cafe: '카페',
    shop: '쇼핑',
    accommodation: '숙박',
    activity: '액티비티',
  };
  return labels[category] || category;
};

export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    restaurant: '🍜',
    cafe: '☕',
    shop: '🛒',
    accommodation: '🏠',
    activity: '🎯',
  };
  return icons[category] || '📍';
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};
