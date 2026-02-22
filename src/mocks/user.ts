import { User } from '@/types';

export const mockUser: User = {
  id: 'user-001',
  kakaoId: '1234567890',
  name: '제주여행러',
  profileImage: '/images/default-profile.png',
  phone: '010-1234-5678',
  createdAt: '2026-01-15T09:00:00Z',
  stats: {
    hammers: 5,
    lottoNumbers: [7, 15, 23, null, null, null] as number[],
    lottoTotal: 6,
    prizesCount: 3,
    reviewsCount: 8,
    visitCount: 12,
  },
  ticket: {
    id: 'ticket-001',
    code: 'JEJU-2026-ABCD-1234',
    type: 'lotto_package',
    days: 3,
    status: 'active',
    registeredAt: '2026-01-28T10:00:00Z',
    expiresAt: '2026-01-31T23:59:59Z',
    visitCount: 5,
  },
};

export const mockUserWithoutTicket: User = {
  ...mockUser,
  ticket: undefined,
};
