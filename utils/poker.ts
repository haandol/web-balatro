// Card 인터페이스 (pages/index.vue 와 동일하게 유지)
export interface Card {
  id: number;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string; // '2', '3', ..., '10', 'J', 'Q', 'K', 'A'
  // 향후 강화, 에디션, 봉인 등을 위한 속성 추가 가능
  enhancement?: string;
  edition?: string;
  seal?: string;
}

// 포커 핸드 타입 정의
export enum HandRank {
  HIGH_CARD = 'High Card',
  PAIR = 'Pair',
  TWO_PAIR = 'Two Pair',
  THREE_OF_A_KIND = 'Three of a Kind',
  STRAIGHT = 'Straight',
  FLUSH = 'Flush',
  FULL_HOUSE = 'Full House',
  FOUR_OF_A_KIND = 'Four of a Kind',
  STRAIGHT_FLUSH = 'Straight Flush',
  ROYAL_FLUSH = 'Royal Flush',
  FIVE_OF_A_KIND = 'Five of a Kind',
  FLUSH_HOUSE = 'Flush House',
  FLUSH_FIVE = 'Flush Five',
}

// 각 핸드의 기본 점수 (SPEC.md 기반)
export const BASE_HAND_SCORES: Record<HandRank, { chips: number; multiplier: number }> = {
  [HandRank.STRAIGHT_FLUSH]: { chips: 100, multiplier: 8 }, // Royal Flush 는 어떻게 처리할지? (일단 SF와 동일하게)
  [HandRank.FOUR_OF_A_KIND]: { chips: 60, multiplier: 7 }, // Spec에는 50, 5로 되어있으나, 게임 내 데이터 확인 필요 (일단 60, 7로)
  [HandRank.FULL_HOUSE]: { chips: 40, multiplier: 4 },
  [HandRank.FLUSH]: { chips: 35, multiplier: 4 },
  [HandRank.STRAIGHT]: { chips: 30, multiplier: 4 },
  [HandRank.THREE_OF_A_KIND]: { chips: 30, multiplier: 3 },
  [HandRank.TWO_PAIR]: { chips: 20, multiplier: 2 },
  [HandRank.PAIR]: { chips: 10, multiplier: 2 },
  [HandRank.HIGH_CARD]: { chips: 5, multiplier: 1 },
  [HandRank.ROYAL_FLUSH]: { chips: 100, multiplier: 8 },
  [HandRank.FIVE_OF_A_KIND]: { chips: 60, multiplier: 7 },
  [HandRank.FLUSH_HOUSE]: { chips: 40, multiplier: 4 },
  [HandRank.FLUSH_FIVE]: { chips: 35, multiplier: 4 },
};

// 랭크를 숫자 값으로 변환하는 헬퍼 함수 (A=14 기준, 필요시 low Ace 처리 추가)
const getRankValue = (rank: string): number => {
  if (/\d/.test(rank)) return parseInt(rank, 10);
  if (rank === 'J') return 11;
  if (rank === 'Q') return 12;
  if (rank === 'K') return 13;
  if (rank === 'A') return 14; // Ace high
  return 0;
};

// 카드를 랭크 기준으로 정렬하는 헬퍼 함수 (내림차순)
const sortCardsByRank = (cards: Card[]): Card[] => {
  return [...cards].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank));
};

// 카드 칩 값 계산 헬퍼 함수 (SPEC.md 기반)
export const getCardChipValue = (card: Card): number => {
  const rank = card.rank;
  if (rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(rank)) return 10;
  return parseInt(rank, 10); // 숫자 카드는 랭크 값 그대로
};


// 핸드 평가 결과 타입
export interface EvaluatedHand {
  rank: HandRank;
  scoringCards: Card[]; // 점수 계산에 직접적으로 기여하는 카드들 (예: 페어 카드 2장)
}

// 핸드 평가 함수 (가장 높은 족보 반환)
export const evaluateHand = (cards: Card[]): EvaluatedHand | null => {
  if (!cards || cards.length === 0 || cards.length > 5) {
      return null; // 유효하지 않은 입력
  }

  const sortedCards = sortCardsByRank(cards);
  const ranks = sortedCards.map(c => c.rank);
  const suits = sortedCards.map(c => c.suit);
  const rankValues = sortedCards.map(c => getRankValue(c.rank));

  const rankCounts: { [rank: string]: number } = {};
  ranks.forEach(rank => { rankCounts[rank] = (rankCounts[rank] || 0) + 1; });
  const counts = Object.values(rankCounts).sort((a, b) => b - a); // [3, 1, 1], [2, 2, 1], [2, 1, 1, 1] 등

  const isFlush = new Set(suits).size === 1;

  // 스트레이트 확인 (Ace low 포함)
  const uniqueSortedValues = [...new Set(rankValues)].sort((a, b) => a - b);
  let isStraight = false;
  if (uniqueSortedValues.length >= 5) { // 최소 5장의 카드가 필요
     isStraight = uniqueSortedValues.every((val, i, arr) => i === 0 || val === arr[i-1] + 1);
     // Ace-low (A, 2, 3, 4, 5) 스트레이트 확인
     if (!isStraight && uniqueSortedValues.join(',') === '2,3,4,5,14') {
         isStraight = true;
         // A-5 스트레이트의 경우, A를 1로 취급하여 정렬 필요 시 여기서 처리
         // 예: 점수 계산 시 가장 높은 카드를 5로 취급
     }
  } else if (cards.length === 5) { // 카드가 5장인데 unique 값이 5개 미만이면 스트레이트 불가
      isStraight = false;
  } else { // 5장 미만 카드로는 스트레이트 불가 (Balatro 기준?) - 일단 불가로 처리
     isStraight = false;
  }


  // 핸드 랭크 결정 (높은 순서대로)
  if (isStraight && isFlush && cards.length === 5) {
      // 로열 플러시는 Straight Flush의 특수 케이스 (10, J, Q, K, A)
      // 필요시 여기서 구분
      return { rank: HandRank.STRAIGHT_FLUSH, scoringCards: sortedCards };
  }
  if (counts[0] === 4) {
      const fourRank = Object.keys(rankCounts).find(r => rankCounts[r] === 4)!;
      return { rank: HandRank.FOUR_OF_A_KIND, scoringCards: sortedCards.filter(c => c.rank === fourRank) };
  }
  if (counts[0] === 3 && counts[1] === 2) {
      return { rank: HandRank.FULL_HOUSE, scoringCards: sortedCards };
  }
  if (isFlush && cards.length === 5) {
      return { rank: HandRank.FLUSH, scoringCards: sortedCards };
  }
  if (isStraight) {
      return { rank: HandRank.STRAIGHT, scoringCards: sortedCards };
  }
  if (counts[0] === 3) {
      const threeRank = Object.keys(rankCounts).find(r => rankCounts[r] === 3)!;
      return { rank: HandRank.THREE_OF_A_KIND, scoringCards: sortedCards.filter(c => c.rank === threeRank) };
  }
  if (counts[0] === 2 && counts[1] === 2) {
      const pairRanks = Object.keys(rankCounts).filter(r => rankCounts[r] === 2);
      return { rank: HandRank.TWO_PAIR, scoringCards: sortedCards.filter(c => pairRanks.includes(c.rank)) };
  }
  if (counts[0] === 2) {
      const pairRank = Object.keys(rankCounts).find(r => rankCounts[r] === 2)!;
      return { rank: HandRank.PAIR, scoringCards: sortedCards.filter(c => c.rank === pairRank) };
  }

  // 위 조건에 모두 해당하지 않으면 High Card
  return { rank: HandRank.HIGH_CARD, scoringCards: [sortedCards[0]] }; // 가장 높은 카드 한 장만
};

// 점수 계산 함수 (기본 버전)
export const calculateScore = (evaluation: EvaluatedHand, playedCards: Card[]) => {
  const baseScore = BASE_HAND_SCORES[evaluation.rank];
  if (!baseScore) {
      console.error("Invalid hand rank for scoring:", evaluation.rank);
      return { chips: 0, multiplier: 0, totalScore: 0, handRank: evaluation.rank };
  }

  let totalChips = baseScore.chips;
  let totalMultiplier = baseScore.multiplier;

  // 플레이된 카드의 칩 값 합산
  playedCards.forEach(card => {
      totalChips += getCardChipValue(card);
      // 여기에 카드 강화(enhancement), 에디션(edition) 효과 추가 예정
  });

  // 조커 효과 추가 예정 (칩 추가, 멀티플라이어 추가/곱하기 등)

  const finalScore = totalChips * totalMultiplier;

  console.log(`Hand: ${evaluation.rank}, Base: ${baseScore.chips} x ${baseScore.multiplier}, Card Chips: ${playedCards.map(getCardChipValue).join('+')}, Total Chips: ${totalChips}, Total Multiplier: ${totalMultiplier}, Final Score: ${finalScore}`);

  return {
      chips: totalChips,
      multiplier: totalMultiplier,
      totalScore: finalScore,
      handRank: evaluation.rank,
  };
};