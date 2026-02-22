# 경품 카테고리 및 망치 소모량별 경품 풀 스펙

## 개요
보물상자에서 망치를 소모하여 얻을 수 있는 경품을 카테고리별로 분류하고, 망치 소모량에 따라 어떤 경품이 나올 수 있는지 사용자에게 미리 보여주기 위한 스펙입니다.

## 경품 카테고리 분류

### 1. 경품 타입 (Prize Type)
- **physical**: 실물 상품 (제주 감귤, 기념품 등)
- **digital**: 디지털 쿠폰/상품권 (스타벅스 쿠폰, 편의점 상품권 등)
- **lotto**: 로또 번호 (추가 번호 획득)

### 2. 경품 등급 (Prize Grade)
- **gold**: 최고 등급 경품 (높은 가치, 낮은 확률)
- **silver**: 중간 등급 경품 (중간 가치, 중간 확률)
- **bronze**: 일반 등급 경품 (낮은 가치, 높은 확률)

### 3. 경품 카테고리 (Prize Category)
각 경품은 다음 카테고리 중 하나에 속해야 합니다:

#### A. 음식/음료 카테고리
- 카페 음료 (스타벅스, 이디야 등)
- 제주 특산물 (감귤, 한라봉 등)
- 제주 맛집 할인쿠폰
- 제주 전통주

#### B. 쇼핑/생활 카테고리
- 편의점 상품권
- 마트 할인쿠폰
- 제주 기념품샵 할인쿠폰
- 면세점 할인쿠폰

#### C. 관광/체험 카테고리
- 관광지 입장권
- 체험 프로그램 할인권
- 투어 할인쿠폰
- 액티비티 할인권

#### D. 숙박/교통 카테고리
- 호텔/펜션 할인쿠폰
- 렌터카 할인쿠폰
- 항공권 할인쿠폰
- 교통패스 할인

#### E. 게임 내 보상 카테고리
- 로또 번호 추가
- 망치 추가 획득
- 특별 이벤트 참여권

## 망치 소모량별 경품 풀 구조

### 보물상자 등급별 망치 소모량
- **금 등급 (Gold)**: 3개 망치 필요
- **은 등급 (Silver)**: 2개 망치 필요
- **동 등급 (Bronze)**: 1개 망치 필요

### 경품 풀 구성 규칙

#### 1. 금 등급 보물상자 (3개 망치)
**필수 포함 경품 카테고리:**
- 최소 1개 이상의 금 등급 경품 포함
- 최소 1개 이상의 실물 상품 또는 고가치 디지털 쿠폰 포함

**경품 풀 예시:**
```
경품 풀 구성:
- 금 등급 경품: 30% 확률
  - 스타벅스 아메리카노 (10%)
  - 제주 감귤 1박스 (10%)
  - 호텔 할인쿠폰 20% (10%)
  
- 은 등급 경품: 50% 확률
  - 편의점 상품권 3000원 (30%)
  - 관광지 입장권 할인 (20%)
  
- 동 등급 경품: 20% 확률
  - 로또 번호 1개 (20%)
```

#### 2. 은 등급 보물상자 (2개 망치)
**필수 포함 경품 카테고리:**
- 최소 1개 이상의 은 등급 이상 경품 포함
- 디지털 쿠폰 또는 중간 가치 상품 포함

**경품 풀 예시:**
```
경품 풀 구성:
- 은 등급 경품: 40% 확률
  - 편의점 상품권 3000원 (25%)
  - 카페 음료 할인쿠폰 (15%)
  
- 동 등급 경품: 60% 확률
  - 로또 번호 1개 (40%)
  - 편의점 할인쿠폰 1000원 (20%)
```

#### 3. 동 등급 보물상자 (1개 망치)
**필수 포함 경품 카테고리:**
- 주로 동 등급 경품 또는 게임 내 보상
- 소액 할인쿠폰 또는 로또 번호

**경품 풀 예시:**
```
경품 풀 구성:
- 동 등급 경품: 100% 확률
  - 로또 번호 1개 (70%)
  - 편의점 할인쿠폰 1000원 (30%)
```

## 클라이언트 요청 사항

### 1. 경품 데이터 구조
각 보물상자(`TreasureSpot`)에 대해 다음 정보가 필요합니다:

```typescript
interface TreasureSpotPrizePool {
  spotId: string;
  grade: 'gold' | 'silver' | 'bronze';
  requiredHits: number; // 망치 소모량
  prizePool: {
    prizeId: string;
    category: PrizeCategory; // 위의 카테고리 중 하나
    probability: number; // 0~1 사이 값, 전체 합계는 1.0이어야 함
    grade: 'gold' | 'silver' | 'bronze';
  }[];
}
```

### 2. 경품 상세 정보
각 경품(`Prize`)에 대해 다음 정보가 필요합니다:

```typescript
interface Prize {
  id: string;
  name: string; // 경품명 (예: "스타벅스 아메리카노")
  icon: string; // 이모지 또는 아이콘 URL
  category: PrizeCategory; // 카테고리
  grade: 'gold' | 'silver' | 'bronze';
  type: 'physical' | 'digital' | 'lotto';
  value?: number; // 경품 가치 (원 단위)
  description?: string; // 경품 설명
  couponCode?: string; // 쿠폰 코드 (디지털 타입인 경우)
  imageUrl?: string; // 경품 이미지 URL
  expiresAt?: string; // 유효기간
  terms?: string; // 사용 조건
}
```

### 3. 경품 카테고리 정의
```typescript
type PrizeCategory = 
  | 'food_beverage'      // 음식/음료
  | 'shopping_life'      // 쇼핑/생활
  | 'tourism_experience' // 관광/체험
  | 'accommodation_transport' // 숙박/교통
  | 'game_reward';       // 게임 내 보상
```

### 4. API 엔드포인트 요청

#### 4.1 보물상자별 경품 풀 조회
```
GET /api/treasure/{spotId}/prize-pool
Response: TreasureSpotPrizePool
```

#### 4.2 경품 상세 정보 조회
```
GET /api/prizes/{prizeId}
Response: Prize
```

#### 4.3 경품 카테고리별 목록 조회
```
GET /api/prizes?category={category}&grade={grade}
Response: Prize[]
```

### 5. UI 표시 요구사항

#### 5.1 보물상자 상세 화면
- 보물상자 클릭 시 확장되어 보이는 영역에:
  - "이 보물상자에서 나올 수 있는 경품" 섹션 추가
  - 경품 카테고리별로 그룹화하여 표시
  - 각 경품의 확률 표시 (예: "30% 확률")
  - 경품 등급별 색상 구분

#### 5.2 경품 미리보기 카드
각 경품 카드에 표시할 정보:
- 경품 아이콘/이미지
- 경품명
- 등급 배지 (금/은/동)
- 카테고리 태그
- 확률 표시
- 가치 표시 (있는 경우)

## 예시 데이터

### 금 등급 보물상자 예시
```json
{
  "spotId": "treasure-001",
  "grade": "gold",
  "requiredHits": 3,
  "prizePool": [
    {
      "prizeId": "prize-starbucks-gold",
      "category": "food_beverage",
      "probability": 0.10,
      "grade": "gold"
    },
    {
      "prizeId": "prize-jeju-tangerine",
      "category": "food_beverage",
      "probability": 0.10,
      "grade": "gold"
    },
    {
      "prizeId": "prize-hotel-coupon",
      "category": "accommodation_transport",
      "probability": 0.10,
      "grade": "gold"
    },
    {
      "prizeId": "prize-convenience-3000",
      "category": "shopping_life",
      "probability": 0.30,
      "grade": "silver"
    },
    {
      "prizeId": "prize-tour-discount",
      "category": "tourism_experience",
      "probability": 0.20,
      "grade": "silver"
    },
    {
      "prizeId": "prize-lotto-number",
      "category": "game_reward",
      "probability": 0.20,
      "grade": "bronze"
    }
  ]
}
```

## 구현 우선순위

### Phase 1 (필수)
1. 경품 카테고리 타입 정의
2. 보물상자별 경품 풀 데이터 구조 확정
3. 경품 상세 정보 API 스펙 확정

### Phase 2 (권장)
1. 보물상자 상세 화면에 경품 미리보기 UI 추가
2. 경품 카테고리별 필터링 기능
3. 확률 표시 및 시각화

### Phase 3 (선택)
1. 경품 히스토리 및 통계
2. 인기 경품 추천
3. 경품 교환 기능

## 참고사항
- 모든 확률의 합은 정확히 1.0이어야 합니다
- 각 보물상자 등급별로 최소 1개 이상의 해당 등급 경품이 포함되어야 합니다
- 경품의 유효기간은 명확히 설정되어야 합니다
- 물리적 상품의 경우 배송 정보가 필요합니다
