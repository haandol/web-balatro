<template>
  <div id="app" class="game-container" :class="{ 'game-over': isGameOver }">
    <GameOverMessage :visible="isGameOver" @restart="restartGame" />

    <div class="balatro-ui">
      <!-- 좌측 정보 패널 -->
      <GameInfoPanel :current-blind="currentBlind" :current-round-score="currentRoundScore" :hand-type="currentHandType"
        :hand-chips="currentHandChips" :hand-multiplier="currentHandMultiplier"
        :last-played-hand-info="formattedLastPlayedHandInfo" :hands-left="handsLeft" :discards-left="discardsLeft"
        :money="money" />

      <!-- 중앙 게임 영역 -->
      <div class="center-area">
        <!-- 조커 슬롯 -->
        <JokerSlot :active-jokers="activeJokers" :max-slots="maxJokerSlots" @select-joker="onJokerSelect" />

        <!-- 카드 영역 -->
        <div class="card-play-area">
          <!-- 선택된 카드들 -->
          <SelectedCardsArea :selected-cards="selectedCards" :empty-slots="emptySelectedSlots" />

          <!-- 플레이어 핸드 -->
          <div class="player-hand">
            <GameCard v-for="card in playerHand" :key="card.id" :card="card" :is-selected="isSelected(card)"
              :is-disabled="isGameOver" @select="toggleCardSelection(card)" />
          </div>
        </div>

        <!-- 컨트롤 버튼 -->
        <GameControls :can-play="canPlay" :can-discard="canDiscard" :hands-left="handsLeft"
          :discards-left="discardsLeft" @play-hand="playHand" @discard-cards="discardCards" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';
import { useBalatroGame } from '@/composables/useBalatroGame';
import { evaluateHand, calculateScore } from '@/utils/poker';
import type { Joker } from '@/utils/joker';

// 이미 존재하는 컴포넌트들
import GameCard from '@/components/GameCard.vue';
import GameOverMessage from '@/components/GameOverMessage.vue';
import JokerSlot from '@/components/JokerSlot.vue';

// 새로 만든 컴포넌트들
import GameInfoPanel from '@/components/GameInfoPanel.vue';
import SelectedCardsArea from '@/components/SelectedCardsArea.vue';
import GameControls from '@/components/GameControls.vue';

const gameStore = useGameStore();

const {
  playerHand,
  selectedCards,
  currentAnteIndex,
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

<style scoped>
/* 전체 게임 컨테이너 */
.game-container {
  font-family: 'Press Start 2P', monospace, sans-serif;
  padding: 20px;
  background-color: #2d5a3a;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  color: white;
  min-height: 95vh;
  display: flex;
  flex-direction: column;
}

.game-over {
  background-color: #3a2d2d;
}

.balatro-ui {
  display: flex;
  gap: 20px;
}

/* 중앙 게임 영역 */
.center-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-play-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #1a1a1a75;
  border-radius: 8px;
  padding: 20px;
}

.player-hand {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}
</style>
