<template>
  <div
    class="mt-5 p-4 bg-white rounded-lg border border-gray-200 min-h-[50px] text-center text-gray-600 flex justify-center items-center gap-4">
    <div v-if="lastPlayedHandInfo" class="mx-2.5">
      Played: {{ lastPlayedHandInfo.handRank }} (Score: {{ lastPlayedHandInfo.score.toLocaleString() }})
    </div>
    <div v-else class="mx-2.5">
      <p>Selected: {{ selectedCardsCount }} / 5</p>
    </div>
    <p class="mx-2.5">Hands Left: {{ handsLeft }}</p>
    <p class="mx-2.5">Discards Left: {{ discardsLeft }}</p>
  </div>
</template>

<script setup lang="ts">
import type { HandRank } from '@/utils/poker'; // HandRank 타입 임포트

interface LastPlayedHandInfo {
  handRank: HandRank;
  score: number; // totalScore에서 score로 변경
}

defineProps<{
  lastPlayedHandInfo: LastPlayedHandInfo | null;
  selectedCardsCount: number;
  handsLeft: number;
  discardsLeft: number;
}>();
</script>