<template>
  <div
    class="w-[90px] h-[120px] bg-[#280b38] border-3 border-[#ffd700] rounded-lg text-white flex flex-col items-center justify-center cursor-pointer shadow-lg p-[5px] m-[5px] transition-all duration-200 font-['Press_Start_2P'] text-shadow-sm relative overflow-hidden hover:-translate-y-1 hover:shadow-xl before:content-[''] before:absolute before:top-[2px] before:left-[2px] before:right-[2px] before:bottom-[2px] before:border before:border-dashed before:border-white/30 before:rounded-md before:pointer-events-none"
    @click="handleClick">
    <div class="flex flex-col items-center w-full h-full">
      <div class="text-[10px] font-bold text-center mb-[5px] w-full overflow-hidden text-ellipsis whitespace-nowrap">
        {{ joker.name }}
      </div>
      <div class="w-[60px] h-[60px] bg-[#5d2a8e] rounded-sm my-[3px] flex items-center justify-center">
        <span class="text-[32px]">🃏</span>
      </div>
      <div class="text-[7px] text-center mt-[5px] leading-tight h-[28px] overflow-hidden px-1">
        {{ joker.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Joker } from '@/utils/joker';

// Props 정의
const props = defineProps<{
  joker: Joker;
  index: number;
}>();

// Emits 정의
const emit = defineEmits<{
  (e: 'select', joker: Joker, index: number): void;
}>();

// 클릭 이벤트 핸들러
const handleClick = () => {
  emit('select', props.joker, props.index);
};
</script>