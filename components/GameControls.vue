<template>
  <div class="game-controls">
    <div class="counter-display">
      <div class="counter">
        <span class="counter-label">남은 핸드:</span>
        <span class="counter-value">{{ handsLeft }}</span>
      </div>
      <div class="counter">
        <span class="counter-label">남은 버리기:</span>
        <span class="counter-value">{{ discardsLeft }}</span>
      </div>
    </div>

    <div class="action-buttons">
      <button class="control-button play-button" :disabled="!canPlay" @click="$emit('play-hand')">
        플레이 ({{ handsLeft }})
      </button>
      <button class="control-button discard-button" :disabled="!canDiscard" @click="$emit('discard-cards')">
        버리기 ({{ discardsLeft }})
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canPlay: boolean;
  canDiscard: boolean;
  handsLeft: number;
  discardsLeft: number;
}>();

defineEmits<{
  'play-hand': [];
  'discard-cards': [];
}>();
</script>

<style scoped>
.game-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: #1a1a1a75;
  border-radius: 8px;
  padding: 15px;
}

.counter-display {
  display: flex;
  justify-content: space-around;
}

.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.counter-label {
  font-size: 14px;
  color: #c8c8c8;
}

.counter-value {
  font-size: 18px;
  color: #ffd700;
}

.action-buttons {
  display: flex;
  justify-content: space-around;
  gap: 15px;
}

.control-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-family: 'Press Start 2P', monospace;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.play-button {
  background-color: #4caf50;
  color: white;
}

.play-button:hover:not(:disabled) {
  background-color: #45a049;
}

.discard-button {
  background-color: #f44336;
  color: white;
}

.discard-button:hover:not(:disabled) {
  background-color: #d32f2f;
}
</style>