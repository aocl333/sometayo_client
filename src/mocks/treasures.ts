import { TreasureSpot, Prize, TreasureGrade } from '@/types';

export const mockTreasures: TreasureSpot[] = [
  {
    id: 'treasure-001',
    name: '협재해수욕장',
    description: '에메랄드빛 바다가 아름다운 협재해수욕장에서 보물을 찾아보세요!',
    position: { lat: 33.3947, lng: 126.2396 },
    grade: 'gold',
    requiredHits: 3,
    distance: 500,
    isActivated: true,
    prizes: [
      { prizeId: 'prize-001', probability: 0.1 },
      { prizeId: 'prize-002', probability: 0.3 },
      { prizeId: 'prize-003', probability: 0.6 },
    ],
  },
  {
    id: 'treasure-002',
    name: '성산일출봉',
    description: '제주의 상징 성산일출봉에서 특별한 보물을 발견하세요!',
    position: { lat: 33.4590, lng: 126.9425 },
    grade: 'gold',
    requiredHits: 3,
    distance: 2800,
    isActivated: false,
    prizes: [
      { prizeId: 'prize-001', probability: 0.15 },
      { prizeId: 'prize-002', probability: 0.35 },
      { prizeId: 'prize-003', probability: 0.5 },
    ],
  },
  {
    id: 'treasure-003',
    name: '만장굴',
    description: '신비로운 용암동굴 만장굴에서 숨겨진 보물을 찾아보세요!',
    position: { lat: 33.5283, lng: 126.7714 },
    grade: 'silver',
    requiredHits: 2,
    distance: 1500,
    isActivated: true,
    prizes: [
      { prizeId: 'prize-002', probability: 0.4 },
      { prizeId: 'prize-003', probability: 0.6 },
    ],
  },
  {
    id: 'treasure-004',
    name: '한라산 입구',
    description: '한라산 등반의 시작점에서 행운의 보물상자를 열어보세요!',
    position: { lat: 33.3617, lng: 126.5292 },
    grade: 'silver',
    requiredHits: 2,
    distance: 3200,
    isActivated: false,
    prizes: [
      { prizeId: 'prize-002', probability: 0.5 },
      { prizeId: 'prize-003', probability: 0.5 },
    ],
  },
  {
    id: 'treasure-005',
    name: '제주 올레시장',
    description: '활기 넘치는 올레시장에서 깜짝 보물을 만나보세요!',
    position: { lat: 33.5113, lng: 126.5198 },
    grade: 'bronze',
    requiredHits: 1,
    distance: 200,
    isActivated: true,
    prizes: [
      { prizeId: 'prize-003', probability: 1.0 },
    ],
  },
];

export const mockPrizes: Prize[] = [
  {
    id: 'prize-001',
    name: '스타벅스 아메리카노',
    icon: '☕',
    grade: 'gold',
    type: 'digital',
    value: 4500,
    couponCode: 'COFFEE-GOLD-001',
    status: 'available',
    obtainedAt: '2026-01-28T10:30:00Z',
    expiresAt: '2026-02-28T23:59:59Z',
  },
  {
    id: 'prize-002',
    name: '편의점 상품권 3000원',
    icon: '🎁',
    grade: 'silver',
    type: 'digital',
    value: 3000,
    couponCode: 'GIFT-SILVER-002',
    status: 'available',
    obtainedAt: '2026-01-27T15:00:00Z',
    expiresAt: '2026-02-27T23:59:59Z',
  },
  {
    id: 'prize-003',
    name: '로또 번호 1개',
    icon: '🎱',
    grade: 'bronze',
    type: 'lotto',
    status: 'used',
    obtainedAt: '2026-01-26T11:00:00Z',
    usedAt: '2026-01-26T11:00:00Z',
  },
  {
    id: 'prize-004',
    name: '제주 감귤 1박스',
    icon: '🍊',
    grade: 'gold',
    type: 'physical',
    value: 25000,
    status: 'available',
    obtainedAt: '2026-01-25T09:00:00Z',
    expiresAt: '2026-03-25T23:59:59Z',
  },
  {
    id: 'prize-005',
    name: 'CU 할인쿠폰 1000원',
    icon: '🏪',
    grade: 'bronze',
    type: 'digital',
    value: 1000,
    couponCode: 'CU-BRONZE-005',
    status: 'expired',
    obtainedAt: '2026-01-10T14:00:00Z',
    expiresAt: '2026-01-20T23:59:59Z',
  },
];

// bgColor: 각 색상의 15% 정도
export const GRADE_CONFIG: Record<TreasureGrade, { label: string; color: string; bgColor: string; requiredHits: number }> = {
  gold: { label: '금', color: '#FFAE00', bgColor: 'rgba(255, 174, 0, 0.15)', requiredHits: 3 },
  silver: { label: '은', color: '#A5A5A5', bgColor: 'rgba(165, 165, 165, 0.15)', requiredHits: 2 },
  bronze: { label: '동', color: '#CD7F32', bgColor: 'rgba(205, 127, 50, 0.15)', requiredHits: 1 },
};

export const getGradeLabel = (grade: TreasureGrade): string => GRADE_CONFIG[grade].label;
export const getGradeColor = (grade: TreasureGrade): string => GRADE_CONFIG[grade].color;
