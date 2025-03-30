<template>
  <div class="game-info-panel">
    <div class="panel-section">
      <h3>현재 블라인드</h3>
      <div class="blind-value">{{ currentBlind?.name }}</div>
      <div class="blind-chips">목표 점수: {{ currentBlind?.targetScore }}</div>
    </div>

    <div class="panel-section">
      <h3>현재 라운드 점수</h3>
      <div class="score-value">{{ currentRoundScore }}</div>
    </div>

    <div class="panel-section">
      <h3>현재 핸드</h3>
      <div class="hand-type">{{ handType }}</div>
      <div class="hand-value">
        <span class="chips">{{ handChips }} 칩</span>
        <span class="multiplier">x{{ handMultiplier }}</span>
      </div>
    </div>

    <div class="panel-section" v-if="lastPlayedHandInfo?.type">
      <h3>마지막 핸드</h3>
      <div class="hand-type">{{ lastPlayedHandInfo.type }}</div>
      <div class="hand-value">
        <span class="chips">{{ lastPlayedHandInfo.chips }} 칩</span>
        <span class="multiplier">x{{ lastPlayedHandInfo.multiplier }}</span>
      </div>
    </div>

    <div class="panel-section">
      <h3>남은 기회</h3>
      <div class="chances">
        <div class="hands">핸드: {{ handsLeft }}</div>
        <div class="discards">버리기: {{ discardsLeft }}</div>
      </div>
    </div>

    <div class="panel-section">
      <h3>골드</h3>
      <div class="money-value">{{ money }}</div>
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

<style scoped>
.game-info-panel {
  width: 250px;
  background-color: #1a1a1a75;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-section {
  border-bottom: 1px solid #ffffff33;
  padding-bottom: 15px;
}

.panel-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

h3 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #c8c8c8;
}

.blind-value,
.hand-type,
.money-value {
  font-size: 16px;
  color: #ffd700;
  margin-bottom: 5px;
}

.blind-chips,
.score-value,
.hand-value,
.chances {
  font-size: 14px;
}

.chips {
  color: #6bf26b;
  margin-right: 8px;
}

.multiplier {
  color: #f26b6b;
}

.hands,
.discards {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}
</style>