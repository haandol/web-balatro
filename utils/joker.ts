// utils/joker.ts
import type { Card, EvaluatedHand } from './poker';

// 조커 효과 발동 시점/조건
export enum JokerTrigger {
    ON_HAND_PLAYED = 'on_hand_played', // 핸드 제출 시
    ON_CARD_SCORED = 'on_card_scored', // 특정 카드가 점수 계산될 때
    PASSIVE = 'passive',             // 항상 적용 (예: 기본 승수 증가)
    // ... 기타 트리거 (카드 버리기 시, 상점 방문 시 등)
}

// 조커 효과 타입
export enum JokerEffectType {
    ADD_CHIPS = 'add_chips',               // 칩 추가
    ADD_MULTIPLIER = 'add_multiplier',       // 승수(Mult) 추가
    MULTIPLY_MULTIPLIER = 'multiply_multiplier', // 승수(Mult) 곱하기 (xMult)
    MODIFY_HAND = 'modify_hand',           // 핸드 판정 규칙 변경
    ECONOMIC = 'economic',               // 돈 관련 효과
    UTILITY = 'utility',               // 기타 유틸리티 (카드 뽑기, 버리기 횟수 등)
    // ... 기타 효과 타입
}

// 조커 희귀도
export enum JokerRarity {
    COMMON = 'Common',
    UNCOMMON = 'Uncommon',
    RARE = 'Rare',
    LEGENDARY = 'Legendary',
}

// 기본 조커 인터페이스
export interface Joker {
    id: string; // 고유 ID (예: 'joker_plus_4_mult')
    name: string;
    description: string;
    rarity: JokerRarity;
    // effectType: JokerEffectType; // 효과가 복합적일 수 있으므로 함수로 처리
    // trigger: JokerTrigger;      // 발동 시점도 복합적일 수 있음

    // 조커 효과를 계산하는 함수들 (상황에 따라 필요한 인자를 받음)
    calculateChips?: (context: ScoreCalculationContext) => number;
    calculateAddedMultiplier?: (context: ScoreCalculationContext) => number;
    calculateMultipliedMultiplier?: (context: ScoreCalculationContext) => number;

    // TODO: 다른 효과 함수들 (modifyHand, economic, utility 등)
}

// 점수 계산 시 조커 함수에 전달될 컨텍스트 정보
export interface ScoreCalculationContext {
    playedCards: Card[];        // 플레이된 카드들
    evaluatedHand: EvaluatedHand; // 평가된 핸드 정보
    currentChips: number;       // 현재까지 계산된 칩 (이 조커 적용 전)
    currentAddedMultiplier: number; // 현재까지 계산된 추가 승수 (이 조커 적용 전)
    // ... 기타 필요한 게임 상태 정보 (현재 안테, 돈 등)
}

// --- 예시 조커 정의 ---
// (실제 구현 시에는 별도 파일이나 데이터베이스에서 로드)

export const JOKER_DATABASE: Record<string, Joker> = {
    'j_plus_4_mult': {
        id: 'j_plus_4_mult',
        name: 'Joker',
        description: '+4 Mult',
        rarity: JokerRarity.COMMON,
        calculateAddedMultiplier: () => 4, // 간단하게 항상 +4 Mult 제공
    },
    'j_jolly': {
        id: 'j_jolly',
        name: 'Jolly Joker',
        description: '+8 Mult if played hand contains a Pair',
        rarity: JokerRarity.COMMON,
        calculateAddedMultiplier: (context) => {
            if (context.evaluatedHand.rank === HandRank.PAIR) {
                return 8;
            }
            return 0;
        },
    },
    'j_greedy': {
        id: 'j_greedy',
        name: 'Greedy Joker',
        description: '+4 Mult for each Diamond card played',
        rarity: JokerRarity.UNCOMMON,
        calculateAddedMultiplier: (context) => {
            const diamondCount = context.playedCards.filter(c => c.suit === 'diamonds').length;
            return diamondCount * 4;
        },
    },
    'j_multiplier': {
        id: 'j_multiplier',
        name: 'Multiplier Joker',
        description: 'x1.5 Mult',
        rarity: JokerRarity.RARE,
        calculateMultipliedMultiplier: () => 1.5, // 항상 x1.5 Mult 제공
    },
    'j_chips': {
        id: 'j_chips',
        name: 'Chips Joker',
        description: '+50 Chips',
        rarity: JokerRarity.COMMON,
        calculateChips: () => 50, // 항상 +50 Chips 제공
    },
};