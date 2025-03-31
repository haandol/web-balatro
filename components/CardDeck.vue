<template>
  <div class="absolute right-[50px] bottom-[130px] flex flex-col items-center gap-2.5 z-10 md:hidden">
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
        <div class="w-[90%] h-[90%] bg-slate-900 rounded-md flex flex-col justify-center items-center">
          <div
            class="w-4/5 h-4/5 rounded border-[3px] border-[#406080] bg-[linear-gradient(45deg,#406080_25%,transparent_25%),linear-gradient(-45deg,#406080_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#406080_75%),linear-gradient(-45deg,transparent_75%,#406080_75%)] bg-[length:10px_10px] bg-[position:0_0,0_5px,5px_-5px,-5px_0px]">
          </div>
          <div class="text-white font-['Press_Start_2P'] text-xs mt-2">
            {{ cardsLeft }}/52
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 데스크톱 버전 - Run Info 대체 -->
  <div class="hidden md:block">
    <div class="p-3 rounded-lg border-2 bg-[#1c2e3e] border-[#2e3b48] flex gap-3 mb-2">
      <div class="bg-[#f44336] rounded-lg p-3 w-20 h-20 flex justify-center items-center">
        <div class="text-base text-white text-center leading-snug">
          <div class="relative w-[60px] h-[60px]">
            <!-- 작은 카드 스택 효과 (데크톱 Run Info 자리) -->
            <div
              class="absolute w-full h-full bg-slate-800 rounded-lg border-[2px] border-slate-600 shadow-md -top-[4px] -left-[4px] -z-10">
            </div>
            <div
              class="absolute w-full h-full bg-slate-800 rounded-lg border-[2px] border-slate-600 shadow-md -top-[2px] -left-[2px] z-0">
            </div>

            <!-- 메인 작은 카드 -->
            <div
              class="absolute w-full h-full bg-slate-800 rounded-lg border-[2px] border-slate-600 shadow-md flex justify-center items-center z-[1]">
              <div class="w-[80%] h-[80%] bg-slate-900 rounded-sm flex flex-col justify-center items-center">
                <div class="w-4/5 h-3/5 rounded border-[2px] border-[#406080] card-pattern"></div>
                <div class="text-white font-['Press_Start_2P'] text-[8px] mt-1">{{ cardsLeft }}/52</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col gap-2">
        <div class="flex-1 bg-[#263238] rounded-lg flex items-center px-2.5">
          <div class="text-xs text-gray-300 flex-1">Hands</div>
          <div class="text-2xl text-[#2196f3] drop-shadow-[1px_1px_0_#000]">{{ handsLeft }}</div>
        </div>
        <div class="flex-1 bg-[#263238] rounded-lg flex items-center px-2.5">
          <div class="text-xs text-gray-300 flex-1">Discards</div>
          <div class="text-2xl text-[#2196f3] drop-shadow-[1px_1px_0_#000]">{{ discardsLeft }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
const { cardsLeft, handsLeft, discardsLeft } = storeToRefs(gameStore)

// 게임 초기화
onMounted(() => {
  gameStore.initializeDeck()
})
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