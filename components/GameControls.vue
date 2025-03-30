<template>
  <div class="flex flex-col gap-3 bg-[#1a1a1a] rounded-lg p-3 shadow-lg border-t-2 border-[#444]">
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-[#263238] rounded-lg p-2 flex flex-col items-center justify-center">
        <span class="text-xs text-[#c8c8c8]">남은 핸드:</span>
        <span class="text-lg text-[#ffd700]">{{ handsLeft }}</span>
      </div>
      <div class="bg-[#263238] rounded-lg p-2 flex flex-col items-center justify-center">
        <span class="text-xs text-[#c8c8c8]">남은 버리기:</span>
        <span class="text-lg text-[#ffd700]">{{ discardsLeft }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button class="py-4 sm:py-3 rounded-lg bg-green-600 text-white font-['Press_Start_2P'] text-sm transition-all duration-200 
        hover:bg-green-700 active:bg-green-800 active:scale-95 active:transition-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50" :disabled="!canPlay"
        @click="$emit('play-hand')">
        플레이 ({{ handsLeft }})
      </button>
      <button class="py-4 sm:py-3 rounded-lg bg-red-600 text-white font-['Press_Start_2P'] text-sm transition-all duration-200 
        hover:bg-red-700 active:bg-red-800 active:scale-95 active:transition-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50" :disabled="!canDiscard"
        @click="$emit('discard-cards')">
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