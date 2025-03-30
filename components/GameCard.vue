<template>
  <div class="inline-block p-2 min-w-[50px] text-center text-2xl bg-white rounded border border-gray-300 shadow-sm
    select-none whitespace-nowrap transition-all duration-100 ease-out
    hover:not-small:transform hover:not-small:-translate-y-1 hover:not-small:shadow-md
    data-[selected=true]:border-blue-500 data-[selected=true]:shadow-blue-200 data-[selected=true]:-translate-y-0.5
    data-[small=true]:text-sm data-[small=true]:p-1 data-[small=true]:min-w-[30px] data-[small=true]:cursor-default"
    :data-selected="isSelected" :data-small="isSmall" :style="{ color: cardColor }" @click="handleClick">
    {{ cardDisplay }}
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue';

interface Card {
  id: number;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  rank: string;
  enhancement?: string;
  edition?: string;
  seal?: string;
}

const props = defineProps<{
  card: Card;
  isSelected: boolean;
  isSmall?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', card: Card): void;
}>();

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

const cardColor = computed(() => {
  return (props.card.suit === 'hearts' || props.card.suit === 'diamonds') ? 'red' : 'black';
});

const handleClick = () => {
  if (!props.isSmall) {
    emit('select', props.card);
  }
};
</script>