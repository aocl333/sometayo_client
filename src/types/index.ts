// User Types
export interface User {
  id: string;
  kakaoId: string;
  name: string;
  profileImage?: string;
  phone?: string;
  createdAt: string;
  stats: UserStats;
  ticket?: Ticket;
}

export interface UserStats {
  hammers: number;
  lottoNumbers: number[];
  lottoTotal: number;
  prizesCount: number;
  reviewsCount: number;
  visitCount: number;
}

// Store Types
export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  address: string;
  phone: string;
  hours: string;
  position: Position;
  distance?: number;
  rating: number;
  reviewCount: number;
  benefit: StoreBenefit;
  images: string[];
}

export type StoreCategory = 'restaurant' | 'cafe' | 'shop' | 'accommodation' | 'activity';

export interface StoreBenefit {
  type: 'free' | 'discount' | 'conditional';
  description: string;
}

export interface Position {
  lat: number;
  lng: number;
}

// Ticket Types
export interface Ticket {
  id: string;
  code: string;
  type: 'normal' | 'lotto_package';
  days: 1 | 3 | 7;
  status: 'active' | 'expired' | 'used';
  registeredAt: string;
  expiresAt: string;
  visitCount: number;
}

// Lotto Types
export interface LottoRound {
  id: string;
  round: number;
  prize: number;
  drawDate: string;
  status: 'active' | 'drawn' | 'closed';
  winningNumbers?: number[];
}

export interface UserLotto {
  round: LottoRound;
  numbers: (number | null)[];
  isComplete: boolean;
}

// Treasure Types
export interface TreasureSpot {
  id: string;
  name: string;
  description: string;
  position: Position;
  grade: TreasureGrade;
  requiredHits: number;
  distance?: number;
  isActivated: boolean;
  prizes: PrizePool[];
}

export type TreasureGrade = 'gold' | 'silver' | 'bronze';

export interface TreasureGame {
  spotId: string;
  currentHits: number;
  requiredHits: number;
  isOpen: boolean;
  result?: Prize;
}

// Prize Types
export interface Prize {
  id: string;
  name: string;
  icon: string;
  grade: TreasureGrade;
  type: 'physical' | 'digital' | 'lotto';
  value?: number;
  couponCode?: string;
  status: PrizeStatus;
  obtainedAt: string;
  expiresAt?: string;
  usedAt?: string;
}

export type PrizeStatus = 'available' | 'used' | 'expired';

export interface PrizePool {
  prizeId: string;
  probability: number;
}

// Review Types
export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  storeId: string;
  rating: number;
  content: string;
  images?: string[];
  reward?: ReviewReward;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ReviewReward {
  type: 'hammer' | 'lotto';
  amount: number;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// UI Types
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'kakao';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'gold' | 'silver' | 'bronze' | 'available' | 'used' | 'expired';
