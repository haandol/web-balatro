<template>
  <div class="flex flex-col gap-4 bg-[#1a1a1a75] rounded-lg p-4">
    <div class="flex justify-around">
      <div class="flex flex-col items-center">
        <span class="text-sm text-[#c8c8c8]">남은 핸드:</span>
        <span class="text-lg text-[#ffd700]">{{ handsLeft }}</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-sm text-[#c8c8c8]">남은 버리기:</span>
        <span class="text-lg text-[#ffd700]">{{ discardsLeft }}</span>
      </div>
    </div>

    <div class="flex justify-around gap-4">
      <button
        class="px-5 py-2.5 rounded bg-green-500 text-white font-['Press_Start_2P'] text-sm transition-all duration-200 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!canPlay" @click="$emit('play-hand')">
        플레이 ({{ handsLeft }})
      </button>
      <button
        class="px-5 py-2.5 rounded bg-red-500 text-white font-['Press_Start_2P'] text-sm transition-all duration-200 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="!canDiscard" @click="$emit('discard-cards')">
        버리기 ({{ discardsLeft }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canPlay: boolean;
  canDiscard: boolean;
  handsLeft: number;
  discardsLeft: number;
}>();

defineEmits<{
  'play-hand': [];
  'discard-cards': [];
}>();
</script>