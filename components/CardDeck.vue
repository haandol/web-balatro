<template>
  <div class="absolute right-[50px] bottom-[130px] flex flex-col items-center gap-2.5 z-10">
    <div class="relative w-[90px] h-[120px]">
      <!-- 뒤에 보이는 덱 카드들 (스택 효과) -->
      <div
        class="absolute w-full h-full bg-slate-800 rounded-lg border-[3px] border-slate-600 shadow-lg -top-[9px] -left-[9px] -z-10">
      </div>
      <div
        class="absolute w-full h-full bg-slate-800 rounded-lg border-[3px] border-slate-600 shadow-lg -top-[6px] -left-[6px] z-0">
      </div>
      <div
        class="absolute w-full h-full bg-slate-800 rounded-lg border-[3px] border-slate-600 shadow-lg -top-[3px] -left-[3px] z-[1]">
      </div>

      <!-- 맨 위의 메인 카드 -->
      <div
        class="absolute w-full h-full bg-slate-800 rounded-lg border-[3px] border-slate-600 shadow-lg flex justify-center items-center z-[2]">
        <div class="w-[90%] h-[90%] bg-slate-900 rounded-md flex justify-center items-center">
          <div
            class="w-4/5 h-4/5 rounded border-[3px] border-[#406080] bg-[linear-gradient(45deg,#406080_25%,transparent_25%),linear-gradient(-45deg,#406080_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#406080_75%),linear-gradient(-45deg,transparent_75%,#406080_75%)] bg-[length:10px_10px] bg-[position:0_0,0_5px,5px_-5px,-5px_0px]">
          </div>
        </div>
      </div>
    </div>
    <div class="w-full p-2.5 bg-slate-800/80 rounded-md text-white font-['Press_Start_2P'] text-xs text-center">
      <div class="flex justify-between mb-1.5">
        <span class="text-gray-300">남은 핸드:</span>
        <span class="text-yellow-400 font-bold">{{ handsLeft }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-300">남은 버리기:</span>
        <span class="text-yellow-400 font-bold">{{ discardsLeft }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  handsLeft: number;
  discardsLeft: number;
}>();
</script>

<style lang="postcss" scoped>
/* 카드 스택 공통 스타일 */
.card-stack {
  @apply absolute w-full h-full bg-slate-800 rounded-lg border-[3px] border-slate-600 shadow-lg;
}

/* 카드 패턴 스타일 - Tailwind로 구현하기 어려운 복잡한 패턴 */
.card-pattern {
  @apply w-4/5 h-4/5 rounded border-[3px] border-[#406080];
  background-image: linear-gradient(45deg, #406080 25%, transparent 25%),
    linear-gradient(-45deg, #406080 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #406080 75%),
    linear-gradient(-45deg, transparent 75%, #406080 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
}
</style>