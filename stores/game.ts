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
  const cardsLeft = ref(52); // 남은 카드 수 추가

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

  // Actions
  function initializeDeck() {
    const newDeck: Card[] = [];
    cardIdCounter.value = 0;

    for (const suit of suits.value) {
      for (const rank of ranks.value) {
        newDeck.push({
          suit,
          rank,
          id: cardIdCounter.value++
        });
      }
    }

    // Fisher-Yates 셔플 알고리즘
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }

    deck.value = newDeck;
    cardsLeft.value = deck.value.length;
    isGameOver.value = false;
    resetRound();
  }

  function drawCard(): Card | undefined {
    if (deck.value.length === 0) {
      isGameOver.value = true;
      return undefined;
    }

    const card = deck.value.pop();
    cardsLeft.value = deck.value.length;
    return card;
  }

  function drawInitialHand() {
    playerHand.value = [];
    for (let i = 0; i < handSize.value; i++) {
      const card = drawCard();
      if (card) {
        playerHand.value.push(card);
      } else {
        // 덱이 비었을 경우
        break;
      }
    }
  }

  function useHand() {
    if (handsLeft.value > 0) {
      handsLeft.value--;
    }
  }

  function useDiscard() {
    if (discardsLeft.value > 0) {
      discardsLeft.value--;
    }
  }

  function resetRound() {
    handsLeft.value = 4;
    discardsLeft.value = 3;
    playerHand.value = [];
    selectedCards.value = [];
    currentRoundScore.value = 0;
    lastPlayedHandInfo.value = null;
    drawInitialHand();
  }

  function startGame() {
    initializeDeck();
    currentAnteIndex.value = 0;
    currentBlindIndex.value = 0;
    money.value = 4;
    activeJokers.value = [];
    isGameOver.value = false;
    resetRound();
  }

  function discardSelectedCards() {
    if (!canDiscard.value) return;

    // 선택된 카드 제거
    const selectedIds = new Set(selectedCards.value.map(c => c.id));
    playerHand.value = playerHand.value.filter(card => !selectedIds.has(card.id));
    
    // 새 카드 뽑기
    for (let i = 0; i < selectedCards.value.length; i++) {
      const card = drawCard();
      if (card) {
        playerHand.value.push(card);
      } else {
        // 덱이 비었을 경우
        break;
      }
    }

    selectedCards.value = [];
    useDiscard();
  }

  function playSelectedCards() {
    if (!canPlay.value) return;
    
    // 여기서 실제 핸드 평가 및 점수 계산을 수행해야 함
    // 현재는 예시로만 구현
    
    // 선택한 카드 처리
    const selectedIds = new Set(selectedCards.value.map(c => c.id));
    playerHand.value = playerHand.value.filter(card => !selectedIds.has(card.id));
    
    // 새 카드 뽑기
    for (let i = 0; i < selectedCards.value.length; i++) {
      const card = drawCard();
      if (card) {
        playerHand.value.push(card);
      } else {
        // 덱이 비었을 경우 게임 종료 처리
        isGameOver.value = true;
        break;
      }
    }
    
    // 핸드 사용 횟수 감소
    useHand();
    
    // 선택된 카드 초기화
    selectedCards.value = [];
    
    // 게임 상태 체크
    if (handsLeft.value === 0) {
      // 라운드 종료 처리
      // 여기서 블라인드 클리어 여부를 확인하고 다음 단계로 진행
    }
  }

  // 카드 선택 토글
  function toggleCardSelection(card: Card) {
    if (isGameOver.value) return;
    
    const selectedIndex = selectedCards.value.findIndex(c => c.id === card.id);
    if (selectedIndex === -1) {
      selectedCards.value.push(card);
    } else {
      selectedCards.value.splice(selectedIndex, 1);
    }
  }

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
    cardsLeft,
    currentBlind,
    isSelected,
    canPlay,
    canDiscard,
    // 액션 함수들 추가
    initializeDeck,
    drawCard,
    drawInitialHand,
    useHand,
    useDiscard,
    resetRound,
    startGame,
    discardSelectedCards,
    playSelectedCards,
    toggleCardSelection
  };
});