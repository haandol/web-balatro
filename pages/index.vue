<template>
  <div id="app"
    class="font-['Press_Start_2P'] p-2 sm:p-5 bg-[#2d5a3a] max-w-[1200px] mx-auto rounded-none shadow-lg relative text-white min-h-[95vh] flex flex-col transition-colors duration-300"
    :class="{ 'bg-[#3a2d2d]': isGameOver }">
    <!-- 조커 상점 컴포넌트 추가 -->
    <JokerShop />

    <GameOverMessage :visible="isGameOver" @restart="restartGame" />

    <!-- 모바일 화면에서는 세로 방향, 데스크톱에서는 가로 방향 -->
    <div class="flex flex-col md:flex-row gap-3 md:gap-5">
      <!-- 좌측 정보 패널 (모바일에서는 상단에 표시) -->
      <div class="md:w-[280px] w-full">
        <GameInfoPanel :current-blind="currentBlind" :current-round-score="currentRoundScore"
          :hand-type="currentHandType" :hand-chips="currentHandChips" :hand-multiplier="currentHandMultiplier"
          :last-played-hand-info="formattedLastPlayedHandInfo" :hands-left="handsLeft" :discards-left="discardsLeft"
          :money="money" />
      </div>

      <!-- 중앙 게임 영역 -->
      <div class="flex-1 flex flex-col gap-3 md:gap-5">
        <!-- 조커 슬롯 -->
        <JokerSlot :active-jokers="activeJokers" :max-slots="maxJokerSlots" @select-joker="onJokerSelect" />

        <!-- 카드 영역 -->
        <div class="flex-1 flex flex-col gap-3 md:gap-5 bg-[#1a1a1a75] rounded-lg p-3 md:p-5">
          <!-- 선택된 카드들 -->
          <SelectedCardsArea :selected-cards="selectedCards" :empty-slots="emptySelectedSlots" />

          <!-- 플레이어 핸드 -->
          <div class="flex flex-wrap justify-center gap-2 md:gap-4">
            <GameCard v-for="card in playerHand" :key="card.id" :card="card" :is-selected="isSelected(card)"
              :is-disabled="isGameOver" @select="toggleCardSelection(card)" />
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 고정 컨트롤 -->
    <div class="mt-3 md:mt-5 sticky bottom-0 z-10">
      <GameControls :can-play="canPlay" :can-discard="canDiscard" :hands-left="handsLeft" :discards-left="discardsLeft"
        @play-hand="playHand" @discard-cards="discardCards" />
    </div>

    <!-- 우측 하단 카드 덱 -->
    <CardDeck :hands-left="handsLeft" :discards-left="discardsLeft" class="hidden md:block" />
  </div>
</template>

<script setup lang="ts">
import { useBalatroGame } from '@/composables/useBalatroGame';
import { evaluateHand, calculateScore } from '@/utils/poker';
import type { Joker } from '@/utils/joker';

const gameStore = useGameStore();

const {
  playerHand,
  selectedCards,
  currentRoundScore,
  handsLeft,
  discardsLeft,
  lastPlayedHandInfo,
  isGameOver,
  currentBlind,
  isSelected,
  canPlay,
  canDiscard,
  activeJokers,
  money,
  maxJokerSlots,
} = storeToRefs(gameStore);

const {
  startGame,
  restartGame,
  toggleCardSelection,
  playHand,
  discardCards,
} = useBalatroGame();

// 현재 선택된 카드로 계산된 핸드 타입과 점수
const currentHandType = ref('');
const currentHandChips = ref(0);
const currentHandMultiplier = ref(1);

// 마지막 플레이 정보 변환을 위한 computed 속성 추가
const formattedLastPlayedHandInfo = computed(() => {
  if (!lastPlayedHandInfo.value) return null;

  return {
    type: lastPlayedHandInfo.value.handRank,
    chips: lastPlayedHandInfo.value.score,
    multiplier: 1 // 현재 데이터에 multiplier가 없어서 기본값 1로 설정
  };
});

// 선택된 카드가 변경될 때마다 핸드 타입과 점수 업데이트
watch(() => selectedCards.value, (newSelectedCards) => {
  if (newSelectedCards.length > 0) {
    const evaluation = evaluateHand(newSelectedCards);
    if (evaluation) {
      currentHandType.value = evaluation.rank;
      const scoreResult = calculateScore(evaluation, newSelectedCards, activeJokers.value);
      currentHandChips.value = scoreResult.chips;
      currentHandMultiplier.value = scoreResult.addedMultiplier;
    } else {
      resetHandTypeInfo();
    }
  } else {
    resetHandTypeInfo();
  }
}, { deep: true });

// 핸드 타입 정보 초기화
const resetHandTypeInfo = () => {
  currentHandType.value = 'Select Cards';
  currentHandChips.value = 0;
  currentHandMultiplier.value = 1;
};

// 선택할 수 있는 빈 슬롯 계산
const emptySelectedSlots = computed(() => {
  return Math.max(0, 5 - selectedCards.value.length);
});

// 조커 선택 처리
const onJokerSelect = (joker: Joker, index: number) => {
  console.log(`Selected joker: ${joker.name} at index ${index}`);
  // TODO: 조커 관련 액션 처리
};

onMounted(() => {
  startGame();
  resetHandTypeInfo();
});
</script>
