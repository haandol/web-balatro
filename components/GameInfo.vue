<template>
  <div class="game-info">
    <div v-if="lastPlayedHandInfo">
      Played: {{ lastPlayedHandInfo.handRank }} (Score: {{ lastPlayedHandInfo.totalScore.toLocaleString() }})
    </div>
    <div v-else>
      <p>Selected: {{ selectedCardsCount }} / 5</p>
    </div>
    <p>Hands Left: {{ handsLeft }}</p>
    <p>Discards Left: {{ discardsLeft }}</p>
  </div>
</template>

<script setup lang="ts">
import type { HandRank } from '@/utils/poker'; // HandRank 타입 임포트

interface LastPlayedHandInfo {
  handRank: HandRank;
  totalScore: number;
}

defineProps<{
  lastPlayedHandInfo: LastPlayedHandInfo | null;
  selectedCardsCount: number;
  handsLeft: number;
  discardsLeft: number;
}>();
</script>

<style scoped>
/* 스타일은 pages/index.vue 에서 가져옵니다 */
.game-info {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #ddd;
  min-height: 50px;
  text-align: center;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.game-info p,
.game-info div {
  margin: 0 10px;
  /* 정보 항목 간 간격 */
}
</style>