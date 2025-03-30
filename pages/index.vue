<template>
  <div id="app" class="game-container">
    <GameOverMessage :visible="isGameOver" @restart="restartGame" />

    <h1>Balatro Clone - Ante {{ currentAnteIndex + 1 }}</h1>

    <BlindInfo :name="currentBlind?.name" :target-score="currentBlind?.targetScore"
      :current-score="currentRoundScore" />

    <!-- 플레이어 핸드 표시 -->
    <div class="player-hand">
      <h2>Your Hand</h2>
      <div class="cards">
        <GameCard v-for="card in playerHand" :key="card.id" :card="card" :is-selected="isSelected(card)"
          :is-disabled="isGameOver" @select="toggleCardSelection(card)" />
      </div>
    </div>

    <GameInfo :last-played-hand-info="lastPlayedHandInfo" :selected-cards-count="selectedCards.length"
      :hands-left="handsLeft" :discards-left="discardsLeft" />

    <GameControls :can-play="canPlay" :can-discard="canDiscard" :hands-left="handsLeft" :discards-left="discardsLeft"
      @play-hand="playHand" @discard-cards="discardCards" />

  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import GameCard from '@/components/GameCard.vue';
import GameOverMessage from '@/components/GameOverMessage.vue';
import BlindInfo from '@/components/BlindInfo.vue';
import GameInfo from '@/components/GameInfo.vue';
import GameControls from '@/components/GameControls.vue';
import { useGameStore } from '@/stores/game';
import { useBalatroGame } from '@/composables/useBalatroGame';
import type { Card } from '@/utils/poker';

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
} = storeToRefs(gameStore);

const {
  startGame,
  restartGame,
  toggleCardSelection,
  playHand,
  discardCards,
} = useBalatroGame();

onMounted(() => {
  startGame();
});

const getCardDisplay = (card: Card): string => {
  let rankDisplay = card.rank;
  let suitSymbol = '';
  switch (card.suit) {
    case 'hearts': suitSymbol = '♥'; break;
    case 'diamonds': suitSymbol = '♦'; break;
    case 'clubs': suitSymbol = '♣'; break;
    case 'spades': suitSymbol = '♠'; break;
  }
  return `${rankDisplay}${suitSymbol}`;
};

const getCardColor = (card: Card): string => {
  return (card.suit === 'hearts' || card.suit === 'diamonds') ? 'red' : 'black';
};

</script>

<style scoped>
.game-container {
  font-family: sans-serif;
  padding: 20px;
  background-color: #f0f0f0;
  max-width: 800px;
  margin: 20px auto;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

h1,
h2 {
  text-align: center;
  color: #333;
}

.player-hand {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
}
</style>
