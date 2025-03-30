<template>
  <div class="card" :class="{ selected: isSelected, small: isSmall }" :style="{ color: cardColor }"
    @click="handleClick">
    {{ cardDisplay }}
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

// Card 인터페이스 정의 (부모 컴포넌트와 동일하게 유지)
interface Card {
  id: number;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string;
  enhancement?: string;
  edition?: string;
  seal?: string;
}

// Props 정의
const props = defineProps<{
  card: Card;
  isSelected: boolean;
  isSmall?: boolean; // 옵셔널 prop, 기본값 false
}>();

// Emits 정의
const emit = defineEmits<{
  (e: 'select', card: Card): void; // 'select' 이벤트와 함께 Card 객체를 전달
}>();

// 카드 표시 텍스트 계산 (예: 'A♥', '10♦')
const cardDisplay = computed(() => {
  let rankDisplay = props.card.rank;
  let suitSymbol = '';
  switch (props.card.suit) {
    case 'hearts': suitSymbol = '♥'; break;
    case 'diamonds': suitSymbol = '♦'; break;
    case 'clubs': suitSymbol = '♣'; break;
    case 'spades': suitSymbol = '♠'; break;
  }
  return `${rankDisplay}${suitSymbol}`;
});

// 카드 텍스트 색상 계산 (하트, 다이아몬드는 빨강, 나머지는 검정)
const cardColor = computed(() => {
  return (props.card.suit === 'hearts' || props.card.suit === 'diamonds') ? 'red' : 'black';
});

// 클릭 이벤트 핸들러
const handleClick = () => {
  // 작은 카드는 선택 불가능하도록 처리 (isSmall prop 사용)
  if (!props.isSmall) {
    emit('select', props.card); // 'select' 이벤트 발생 및 카드 정보 전달
  }
};
</script>

<style scoped>
/* 카드 기본 스타일 */
.card {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px 8px;
  min-width: 50px;
  /* 카드 최소 너비 */
  text-align: center;
  font-size: 1.5em;
  /* 카드 폰트 크기 */
  background-color: white;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  display: inline-block;
  /* 카드가 옆으로 나열되도록 */
  white-space: nowrap;
  /* 카드 내용 줄바꿈 방지 */
  cursor: pointer;
  /* 클릭 가능한 커서 모양 */
  user-select: none;
  /* 텍스트 선택 방지 */
  transition: transform 0.1s ease-out, box-shadow 0.1s ease-out, border-color 0.1s ease-out;
  /* 부드러운 전환 효과 */
}

/* 작은 카드가 아닐 때만 마우스 호버 효과 적용 */
.card:not(.small):hover {
  transform: translateY(-3px);
  /* 위로 살짝 이동 */
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.15);
  /* 그림자 강조 */
}

/* 선택된 카드 스타일 */
.card.selected {
  border-color: #007bff;
  /* 파란색 테두리 */
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
  /* 파란색 네온 효과 */
  transform: translateY(-2px);
  /* 위로 살짝 이동하여 구분 */
}

/* 작은 카드 스타일 (덱 표시용) */
.card.small {
  font-size: 0.8em;
  /* 작은 폰트 */
  padding: 5px 4px;
  /* 작은 패딩 */
  min-width: 30px;
  /* 더 작은 너비 */
  cursor: default;
  /* 클릭 불가능 커서 */
}

/* 작은 카드는 호버 효과 없음 */
.card.small:hover {
  transform: none;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  /* 기본 그림자 유지 */
}

/* 카드 색상은 :style 바인딩으로 처리되지만, 명시적 스타일 규칙을 원할 경우 주석 해제 가능
.card[style*="color: red"] { color: red; }
.card[style*="color: black"] { color: black; }
*/
</style>