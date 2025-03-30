<template>
  <div class="selected-cards-area">
    <div v-for="(card, index) in selectedCards" :key="card.id" class="selected-card-slot">
      <GameCard :card="card" :is-selected="true" :is-disabled="false" />
    </div>
    <div v-for="n in emptySlots" :key="`empty-${n}`" class="empty-card-slot">
      <div class="empty-slot-placeholder">+</div>
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

<style scoped>
.selected-cards-area {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  min-height: 130px;
  padding: 10px;
  background-color: #00000033;
  border-radius: 8px;
}

.selected-card-slot,
.empty-card-slot {
  width: 80px;
  height: 110px;
  border-radius: 5px;
}

.empty-card-slot {
  border: 2px dashed #ffffff55;
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-slot-placeholder {
  font-size: 24px;
  color: #ffffff55;
}
</style>