<template>
  <div class="flex justify-center gap-4 mb-8 min-h-[130px] p-2.5 bg-black/20 rounded-lg">
    <div v-for="(card, index) in selectedCards" :key="card.id" class="w-[80px] h-[110px] rounded">
      <GameCard :card="card" :is-selected="true" :is-disabled="false" />
    </div>
    <div v-for="n in emptySlots" :key="`empty-${n}`"
      class="w-[80px] h-[110px] rounded border-2 border-dashed border-white/30 flex justify-center items-center">
      <div class="text-2xl text-white/30">+</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameCard from './GameCard.vue';
import type { Card } from '@/utils/poker';

defineProps<{
  selectedCards: Card[];
  emptySlots: number;
}>();
</script>