<template>
  <div class="w-full p-2.5 bg-[#1e1e1e] rounded-lg border-2 border-[#444] mb-5">
    <h3
      class="font-['Press_Start_2P'] text-[#ffd700] text-center m-0 mb-2.5 text-sm shadow-[2px_2px_0px_rgba(0,0,0,0.5)]">
      조커 슬롯
    </h3>
    <div class="flex flex-wrap gap-2.5 justify-center p-1">
      <div v-for="(joker, index) in activeJokers" :key="joker.id" class="w-[90px] h-[120px] mx-1">
        <JokerCard :joker="joker" :index="index" @select="onJokerSelect" />
      </div>
      <!-- 빈 슬롯 표시 -->
      <div v-for="i in emptySlots" :key="`empty-${i}`" class="w-[90px] h-[120px] mx-1">
        <div
          class="w-[90px] h-[120px] bg-white/10 border-2 border-dashed border-[#444] rounded-lg flex items-center justify-center text-[#777] text-[10px] font-['Press_Start_2P']">
          비어있음
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JokerCard from './JokerCard.vue';
import type { Joker } from '@/utils/joker';

// Props 정의
const props = defineProps<{
  activeJokers: Joker[];
  maxSlots: number;
}>();

// 이벤트 정의
const emit = defineEmits<{
  (e: 'select-joker', joker: Joker, index: number): void;
}>();

// 비어있는 슬롯 수 계산
const emptySlots = computed(() => {
  return Math.max(0, props.maxSlots - props.activeJokers.length);
});

// 조커 선택 이벤트 핸들러
const onJokerSelect = (joker: Joker, index: number) => {
  emit('select-joker', joker, index);
};
</script>