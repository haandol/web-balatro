<template>
  <div class="bg-[#1a1a1a75] rounded-lg p-2 sm:p-3">
    <div class="text-center text-sm text-white mb-2">
      <h2>조커 ({{ activeJokers.length }}/{{ maxSlots }})</h2>
    </div>

    <!-- 모바일에서는 가로 스크롤, 데스크톱에서는 그리드 레이아웃 -->
    <div class="overflow-x-auto md:overflow-hidden pb-2 md:pb-0">
      <div class="flex md:flex-wrap md:justify-center gap-2 min-w-fit">
        <div v-for="(joker, index) in activeJokers" :key="joker.id" class="flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-[#202c3a] rounded-lg border-2 border-[#3a4d5c] p-1 md:p-2
            flex flex-col justify-between items-center cursor-pointer
            hover:border-[#ffd700] hover:bg-[#25354a] transition-all duration-150"
          @click="emit('select-joker', joker, index)">
          <div class="text-xs text-center text-[#8df] line-clamp-2">{{ joker.name }}</div>
          <div class="text-xs text-center text-white mt-2">{{ joker.description }}</div>
        </div>

        <!-- 빈 슬롯 표시 -->
        <div v-for="i in Math.max(0, maxSlots - activeJokers.length)" :key="`empty-${i}`" class="flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 md:w-24 md:h-28 bg-[#1a1a1a] rounded-lg border-2 border-dashed border-[#3a3a3a]
            flex items-center justify-center">
          <span class="text-[#5a5a5a] text-2xl">+</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Joker } from '@/utils/joker';

defineProps<{
  activeJokers: Joker[];
  maxSlots: number;
}>();

const emit = defineEmits<{
  (e: 'select-joker', joker: Joker, index: number): void;
}>();
</script>