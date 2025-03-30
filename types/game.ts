import type { Card, HandRank } from '@/utils/poker'; // 다른 타입도 필요 시 임포트
import type { Joker } from '@/utils/joker'; // Joker 타입 임포트

// --- 게임 데이터 구조 정의 ---
export interface Blind {
    name: string;
    targetScore: number;
}

export interface Ante {
    blinds: Blind[];
}

// --- 스토어 상태 타입 정의 (여기서 관리하거나 stores/game.ts에 유지) ---
export interface GameState {
  deck: Card[];
  playerHand: Card[];
  selectedCards: Card[];
  cardIdCounter: number;
  currentAnteIndex: number;
  currentBlindIndex: number;
  currentRoundScore: number;
  handsLeft: number;
  discardsLeft: number;
  lastPlayedHandInfo: { handRank: HandRank, totalScore: number } | null;
  isGameOver: boolean;
  // 설정 값
  handSize: number;
  antes: Ante[]; // 위에서 정의한 Ante 사용
  suits: Card['suit'][];
  ranks: string[];
  activeJokers: Joker[];
  money: number;
  maxJokerSlots: number;
}

// --- 다른 공유 타입들 (필요 시 추가) ---