import type { Card } from '@/utils/poker'; // HandRank 제거 (GameState에 포함됨)
import { initialAntes, initialSuits, initialRanks } from '@/data/gameData'; // 데이터 임포트
import type { Blind, Ante, GameState } from '@/types/game'; // 타입 임포트

// --- 데이터 구조 및 상태 로컬 정의 제거 ---
// interface Blind { ... }
// interface Ante { ... }
// interface GameState { ... }

// --- 데이터 로컬 정의 제거 (이미 완료됨) ---

export const useGameStore = defineStore('game', {
  // state 타입으로 GameState 임포트 사용
  state: (): GameState => ({
    deck: [],
    playerHand: [],
    selectedCards: [],
    cardIdCounter: 0,
    currentAnteIndex: 0,
    currentBlindIndex: 0,
    currentRoundScore: 0,
    handsLeft: 4,
    discardsLeft: 3,
    lastPlayedHandInfo: null,
    isGameOver: false,
    handSize: 8,
    antes: initialAntes,
    suits: initialSuits,
    ranks: initialRanks,
  }),

  getters: {
    // currentBlind 반환 타입으로 Blind 임포트 사용
    currentBlind(state): Blind | null {
      if (state.currentAnteIndex < state.antes.length && state.currentBlindIndex < state.antes[state.currentAnteIndex].blinds.length) {
        return state.antes[state.currentAnteIndex].blinds[state.currentBlindIndex];
      }
      return null;
    },
    // isSelected 타입 Card 임포트 사용 (이미 Card 임포트됨)
    isSelected(state): (card: Card) => boolean {
      const selectedIds = new Set(state.selectedCards.map(c => c.id));
      return (card: Card) => selectedIds.has(card.id);
    },
    // canPlay, canDiscard 변경 없음
    canPlay(state): boolean {
        return state.selectedCards.length > 0 && state.selectedCards.length <= 5 && state.handsLeft > 0 && !state.isGameOver;
    },
    canDiscard(state): boolean {
        return state.selectedCards.length > 0 && state.selectedCards.length <= 5 && state.discardsLeft > 0 && !state.isGameOver;
    },
  },

  actions: {
    // 변경 없음 (비어 있음)
  },
});