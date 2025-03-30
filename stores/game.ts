import type { Card, HandRank } from '@/utils/poker'; // HandRank 추가
import { initialAntes, initialSuits, initialRanks } from '@/data/gameData'; // 데이터 임포트
import type { Blind, GameState } from '@/types/game'; // 타입 임포트
import type { Joker } from '@/utils/joker'; // Joker 타입 임포트

// defineStore의 setup 함수 사용
export const useGameStore = defineStore('game', () => {
  // State (ref 사용)
  const deck = ref<Card[]>([]);
  const playerHand = ref<Card[]>([]);
  const selectedCards = ref<Card[]>([]);
  const cardIdCounter = ref(0);
  const currentAnteIndex = ref(0);
  const currentBlindIndex = ref(0);
  const currentRoundScore = ref(0);
  const handsLeft = ref(4);
  const discardsLeft = ref(3);
  const lastPlayedHandInfo = ref<{ handRank: HandRank; score: number } | null>(null); // HandRank 임포트 확인
  const isGameOver = ref(false);
  const handSize = ref(8);
  const antes = ref(initialAntes); // initialAntes 사용
  const suits = ref(initialSuits); // initialSuits 사용
  const ranks = ref(initialRanks); // initialRanks 사용
  const activeJokers = ref<Joker[]>([]);
  const money = ref(4);
  const maxJokerSlots = ref(5);

  // Getters (computed 사용)
  const currentBlind = computed((): Blind | null => {
    const ante = antes.value[currentAnteIndex.value];
    if (ante && currentBlindIndex.value < ante.blinds.length) {
      return ante.blinds[currentBlindIndex.value];
    }
    return null;
  });

  const isSelected = computed(() => {
    const selectedIds = new Set(selectedCards.value.map(c => c.id));
    return (card: Card) => selectedIds.has(card.id);
  });

  const canPlay = computed((): boolean => {
    return selectedCards.value.length > 0 && selectedCards.value.length <= 5 && handsLeft.value > 0 && !isGameOver.value;
  });

  const canDiscard = computed((): boolean => {
    return selectedCards.value.length > 0 && selectedCards.value.length <= 5 && discardsLeft.value > 0 && !isGameOver.value;
  });

  // Actions (일반 함수로 정의)
  // actions 내용은 비어 있으므로, 필요 시 여기에 함수 추가

  // 상태, 게터, 액션 반환
  return {
    deck,
    playerHand,
    selectedCards,
    cardIdCounter,
    currentAnteIndex,
    currentBlindIndex,
    currentRoundScore,
    handsLeft,
    discardsLeft,
    lastPlayedHandInfo,
    isGameOver,
    handSize,
    antes,
    suits,
    ranks,
    activeJokers,
    money,
    maxJokerSlots,
    currentBlind,
    isSelected,
    canPlay,
    canDiscard,
    // 여기에 액션 함수들을 추가
  };
});