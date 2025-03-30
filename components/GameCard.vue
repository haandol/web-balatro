<template>
  <div
    class="inline-block p-1 sm:p-2 min-w-[40px] sm:min-w-[50px] text-center text-lg sm:text-2xl bg-white rounded border border-gray-300 shadow-sm
    select-none whitespace-nowrap transition-all duration-100 ease-out
    hover:md:transform hover:md:-translate-y-1 hover:md:shadow-md
    active:bg-gray-100 active:scale-95 md:active:scale-100
    data-[selected=true]:bg-blue-50 data-[selected=true]:border-blue-500 data-[selected=true]:shadow-blue-200 data-[selected=true]:-translate-y-0.5
    data-[small=true]:text-xs sm:data-[small=true]:text-sm data-[small=true]:p-0.5 sm:data-[small=true]:p-1 data-[small=true]:min-w-[25px] sm:data-[small=true]:min-w-[30px] data-[small=true]:cursor-default"
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
  isDisabled?: boolean;
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
  if (!props.isSmall && !props.isDisabled) {
    emit('select', props.card);
  }
};
</script>