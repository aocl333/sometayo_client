import { LottoRound, UserLotto } from '@/types';

// 로또 번호별 색상 (1~10 노랑, 11~20 파랑, 21~30 빨강, 31~40 회색, 41~45 초록)
export const LOTTO_BALL_COLORS: Record<number, string> = {
  1: '#FFCB49', 2: '#FFCB49', 3: '#FFCB49', 4: '#FFCB49', 5: '#FFCB49',
  6: '#FFCB49', 7: '#FFCB49', 8: '#FFCB49', 9: '#FFCB49', 10: '#FFCB49',
  11: '#2196F3', 12: '#2196F3', 13: '#2196F3', 14: '#2196F3', 15: '#2196F3',
  16: '#2196F3', 17: '#2196F3', 18: '#2196F3', 19: '#2196F3', 20: '#2196F3',
  21: '#FF4635', 22: '#FF4635', 23: '#FF4635', 24: '#FF4635', 25: '#FF4635',
  26: '#FF4635', 27: '#FF4635', 28: '#FF4635', 29: '#FF4635', 30: '#FF4635',
  31: '#636363', 32: '#636363', 33: '#636363', 34: '#636363', 35: '#636363',
  36: '#636363', 37: '#636363', 38: '#636363', 39: '#636363', 40: '#636363',
  41: '#4CAF50', 42: '#4CAF50', 43: '#4CAF50', 44: '#4CAF50', 45: '#4CAF50',
};

export const getLottoBallColor = (num: number): string => LOTTO_BALL_COLORS[num] ?? '#636363';

export const mockCurrentRound: LottoRound = {
  id: 'round-2026-05',
  round: 5,
  prize: 50000000, // 5천만원
  drawDate: '2026-02-08T20:00:00Z',
  status: 'active',
};

// 여러 장의 로또 지원 (시안 기준)
export const mockUserLottos: UserLotto[] = [
  {
    round: mockCurrentRound,
    numbers: [2, 27, 35, 31, 42, 45],
    isComplete: true,
  },
  {
    round: mockCurrentRound,
    numbers: [11, 27, 35, 31, null, null],
    isComplete: false,
  },
  {
    round: mockCurrentRound,
    numbers: [null, null, null, null, null, null],
    isComplete: false,
  },
];

// 하위 호환을 위해 유지
export const mockUserLotto: UserLotto = mockUserLottos[0];

export const mockLottoHistory: { round: LottoRound; userNumbers: number[]; matchCount: number; prize: number }[] = [
  {
    round: {
      id: 'round-2026-04',
      round: 4,
      prize: 50000000,
      drawDate: '2026-02-02T20:00:00Z',
      status: 'drawn',
      winningNumbers: [5, 11, 27, 35, 38, 42],
    },
    userNumbers: [11, 27, 31, 35, 37, 44],
    matchCount: 3,
    prize: 5000,
  },
  {
    round: {
      id: 'round-2026-03',
      round: 3,
      prize: 42000000,
      drawDate: '2026-01-25T20:00:00Z',
      status: 'drawn',
      winningNumbers: [5, 11, 22, 29, 38, 45],
    },
    userNumbers: [7, 14, 21, 28, 35, 42],
    matchCount: 0,
    prize: 0,
  },
  {
    round: {
      id: 'round-2026-02',
      round: 2,
      prize: 38000000,
      drawDate: '2026-01-18T20:00:00Z',
      status: 'drawn',
      winningNumbers: [2, 9, 16, 24, 31, 40],
    },
    userNumbers: [2, 9, 16, 24, 31, 40],
    matchCount: 6,
    prize: 38000000,
  },
];

export const formatPrize = (amount: number): string => {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(0)}억원`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만원`;
  }
  return `${amount.toLocaleString()}원`;
};

export const getDaysUntilDraw = (drawDate: string): number => {
  const now = new Date();
  const draw = new Date(drawDate);
  const diff = draw.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};
