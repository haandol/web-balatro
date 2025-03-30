import type { Card } from '@/utils/poker';
import type { Ante } from '@/types/game';

export const initialAntes: Ante[] = [
    { // Ante 1
        blinds: [
            { name: 'Small Blind', targetScore: 300, reward: 3 },
            { name: 'Big Blind', targetScore: 450, reward: 5 },
            { name: 'The Hook (Boss)', targetScore: 600, reward: 8 },
        ]
    },
    { // Ante 2
        blinds: [
            { name: 'Small Blind', targetScore: 1000, reward: 3 },
            { name: 'Big Blind', targetScore: 1500, reward: 5 },
            { name: 'The Wall (Boss)', targetScore: 2000, reward: 8 },
        ]
    },
    // ... 추가 안테 정의
];

export const initialSuits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];

export const initialRanks: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];