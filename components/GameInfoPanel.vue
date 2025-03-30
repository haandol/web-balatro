<template>
  <div class="flex flex-col gap-2 font-['Press_Start_2P']">
    <!-- 모바일용 간소화된 정보 패널 -->
    <div class="md:hidden">
      <div class="grid grid-cols-3 gap-2">
        <!-- 블라인드 요약 정보 -->
        <div class="col-span-2 p-2 rounded-lg border-2 bg-[#8b5e00] border-[#a57211]">
          <div class="text-sm text-center text-white mb-1">{{ currentBlind?.name || "Big Blind" }}</div>
          <div class="flex justify-center gap-1">
            <div class="text-xs text-[#ffd700]">목표: {{ currentBlind?.targetScore || 1200 }}</div>
            <div class="text-xs text-[#ffd700]">| ${{ currentBlind?.reward || 0 }}</div>
          </div>
        </div>

        <!-- 골드 정보 -->
        <div class="p-2 rounded-lg border-2 bg-[#1c2e3e] border-[#2e3b48] flex justify-center items-center">
          <div class="text-xl text-[#ffd700]">${{ money }}</div>
        </div>
      </div>

      <!-- 스코어 및 핸드 정보 -->
      <div class="grid grid-cols-2 gap-2 mt-2">
        <div class="p-2 rounded-lg border-2 bg-[#1c2e3e] border-[#2e3b48] flex items-center justify-between">
          <div class="text-xs text-white">Round<br>score</div>
          <div class="text-xl text-white">{{ currentRoundScore }}</div>
        </div>

        <div class="p-2 rounded-lg border-2 bg-[#1c2e3e] border-[#2e3b48] text-center">
          <div class="text-xs text-white mb-1">{{ handType }}</div>
          <div class="flex justify-around items-center">
            <div class="bg-[#2196f3] text-white text-xs px-2 py-1 rounded">{{ handChips }}</div>
            <div class="text-xs text-white">x</div>
            <div class="bg-[#f44336] text-white text-xs px-2 py-1 rounded">{{ handMultiplier }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 데스크톱용 원래 정보 패널 -->
    <div class="hidden md:block w-[280px]">
      <!-- 블라인드 정보 -->
      <div class="p-3 rounded-lg border-2 bg-[#8b5e00] border-[#a57211] mb-2">
        <div class="text-2xl text-center text-white mb-3 drop-shadow-[2px_2px_0_#000]">
          {{ currentBlind?.name || "Big Blind" }}
        </div>
        <div class="flex items-center gap-2.5">
          <div class="w-20 h-20 flex justify-center items-center">
            <div
              class="w-[60px] h-[60px] bg-[#b37400] rounded-full flex justify-center items-center border-2 border-[#ffc107]">
              <div class="text-[10px] text-center text-white">BIG<br>BLIND</div>
            </div>
          </div>
          <div class="flex-1 bg-[#1c1c1c] rounded-lg p-2.5 text-center">
            <div class="text-[10px] text-gray-300">Score at least</div>
            <div class="text-[28px] text-[#ff4040] my-2 drop-shadow-[2px_2px_0_#000]">
              {{ currentBlind?.targetScore || 1200 }}
            </div>
            <div class="text-[10px] text-[#ffd700]">to earn ${{ currentBlind?.reward || 0 }}</div>
          </div>
        </div>
      </div>

      <!-- 라운드 점수 -->
      <div class="p-3 rounded-lg border-2 bg-[#1c2e3e] border-[#2e3b48] flex items-center justify-between mb-2">
        <div class="text-sm text-white leading-snug">Round<br>score</div>
        <div class="text-4xl text-white drop-shadow-[2px_2px_0_#000]">{{ currentRoundScore }}</div>
      </div>

      <!-- 현재 핸드 -->
      <div class="p-3 rounded-lg border-2 bg-[#1c2e3e] border-[#2e3b48] text-center mb-2">
        <div class="text-2xl text-white mb-3 drop-shadow-[2px_2px_0_#000]">{{ handType }}</div>
        <div class="flex justify-center items-center gap-2">
          <div
            class="bg-[#2196f3] text-white text-3xl px-4 py-2 rounded-lg min-w-[80px] text-center drop-shadow-[2px_2px_0_#000]">
            {{ handChips }}
          </div>
          <div class="text-2xl text-white">x</div>
          <div
            class="bg-[#f44336] text-white text-3xl px-4 py-2 rounded-lg min-w-[60px] text-center drop-shadow-[2px_2px_0_#000]">
            {{ handMultiplier }}
          </div>
        </div>
      </div>

      <!-- 기회 및 버튼 -->
      <div class="p-3 rounded-lg border-2 bg-[#1c2e3e] border-[#2e3b48] flex gap-3 mb-2">
        <div class="bg-[#f44336] rounded-lg p-3 w-20 h-20 flex justify-center items-center cursor-pointer">
          <div class="text-base text-white text-center leading-snug">Run<br>Info</div>
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

      <!-- 골드 -->
      <div
        class="p-3 rounded-lg border-2 bg-[#1c2e3e] border-[#2e3b48] flex justify-center items-center min-h-[60px] mb-2">
        <div class="text-2xl text-[#ffd700] drop-shadow-[2px_2px_0_#000]">${{ money }}</div>
      </div>

      <!-- 앤티 및 라운드 -->
      <div class="p-3 rounded-lg border-2 bg-[#1c2e3e] border-[#2e3b48] flex gap-3">
        <div class="bg-[#ff9800] rounded-lg p-3 w-20 h-20 flex justify-center items-center cursor-pointer">
          <div class="text-base text-white text-center">Options</div>
        </div>
        <div class="flex-1 flex flex-col gap-2">
          <div class="flex-1 bg-[#263238] rounded-lg flex items-center px-2.5">
            <div class="text-xs text-gray-300 flex-1">Ante</div>
            <div class="text-2xl text-[#ff9800] drop-shadow-[1px_1px_0_#000]">2/8</div>
          </div>
          <div class="flex-1 bg-[#263238] rounded-lg flex items-center px-2.5">
            <div class="text-xs text-gray-300 flex-1">Round</div>
            <div class="text-2xl text-[#ff9800] drop-shadow-[1px_1px_0_#000]">4</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Blind } from '@/types/game';

interface LastPlayedHandInfo {
  type?: string;
  chips?: number;
  multiplier?: number;
}

defineProps<{
  currentBlind: Blind | null;
  currentRoundScore: number;
  handType: string;
  handChips: number;
  handMultiplier: number;
  lastPlayedHandInfo: LastPlayedHandInfo | null;
  handsLeft: number;
  discardsLeft: number;
  money: number;
}>();
</script>