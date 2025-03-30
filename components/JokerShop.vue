<template>
  <div v-if="showJokerShop" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div class="w-[90%] max-w-[800px] bg-[#1a1a2e] border-4 border-[#ffd700] rounded-lg p-6 relative">
      <!-- 상점 제목 -->
      <div class="text-2xl text-white font-['Press_Start_2P'] mb-6 text-center">
        조커 상점 - {{ currentBlind?.name || '블라인드' }}
      </div>

      <!-- 현재 보유 돈 -->
      <div class="text-white font-['Press_Start_2P'] text-xl mb-4 flex items-center justify-center">
        보유 금액: <span class="text-yellow-400 ml-2">{{ money }}$</span>
      </div>

      <!-- 조커 선택 영역 -->
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 mb-6">
        <div v-for="(joker, index) in availableJokers" :key="joker.id" class="relative">
          <JokerCard :joker="joker" :index="index" @select="selectJoker" />

          <!-- 가격 표시 -->
          <div
            class="absolute bottom-1 right-1 bg-black/70 text-yellow-400 px-2 py-1 rounded-md font-['Press_Start_2P'] text-xs">
            {{ getJokerPrice(joker) }}$
          </div>
        </div>
      </div>

      <!-- 조커 정보 (선택 시) -->
      <div v-if="selectedJoker" class="bg-[#2a2a4a] p-4 rounded-lg mb-6">
        <div class="text-xl text-white font-['Press_Start_2P'] mb-2">{{ selectedJoker.name }}</div>
        <div class="text-white mb-2">{{ selectedJoker.description }}</div>
        <div class="flex gap-2">
          <div class="text-sm text-blue-300">희귀도: {{ selectedJoker.rarity }}</div>
          <div class="text-sm text-yellow-400">가격: {{ getJokerPrice(selectedJoker) }}$</div>
        </div>
      </div>

      <!-- 버튼 영역 -->
      <div class="flex justify-center gap-4">
        <button v-if="selectedJoker" @click="buySelectedJoker" :disabled="!canBuySelected" :class="[
          'px-6 py-3 rounded-md font-[\'Press_Start_2P\'] text-sm',
          canBuySelected ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed'
        ]">
          구매 ({{ getJokerPrice(selectedJoker) }}$)
        </button>

        <button @click="closeShop"
          class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-md font-['Press_Start_2P'] text-sm">
          닫기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '~/stores/game';
import { useBalatroGame } from '~/composables/useBalatroGame';
import type { Joker } from '~/utils/joker';

const gameStore = useGameStore();
const { buyJoker, closeJokerShop } = useBalatroGame();

// 스토어에서 필요한 상태 가져오기
const { availableJokers, showJokerShop, money, currentBlind } = storeToRefs(gameStore);

// 선택된 조커
const selectedJoker = ref<Joker | null>(null);

// 조커 가격 계산 함수
const getJokerPrice = (joker: Joker) => {
  return gameStore.getJokerPrice(joker);
};

// 현재 선택된 조커를 구매할 수 있는지 확인
const canBuySelected = computed(() => {
  if (!selectedJoker.value) return false;

  const price = getJokerPrice(selectedJoker.value);
  return money.value >= price && gameStore.activeJokers.length < gameStore.maxJokerSlots;
});

// 조커 선택 함수
const selectJoker = (joker: Joker) => {
  selectedJoker.value = joker;
};

// 선택된 조커 구매 함수
const buySelectedJoker = () => {
  if (!selectedJoker.value || !canBuySelected.value) return;

  const success = buyJoker(selectedJoker.value);
  if (success) {
    // 구매 성공한 경우, 선택된 조커가 availableJokers에서 제거되었을 수 있으므로 선택 초기화
    selectedJoker.value = null;

    // 사용 가능한 조커가 없으면 상점 닫기
    if (availableJokers.value.length === 0) {
      closeShop();
    }
  }
};

// 상점 닫기 함수
const closeShop = () => {
  closeJokerShop();
  selectedJoker.value = null;
};
</script>