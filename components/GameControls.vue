<template>
  <div class="game-controls">
    <button :disabled="!canPlay" @click="onPlayHand">
      Play Hand ({{ handsLeft }})
    </button>
    <button :disabled="!canDiscard" @click="onDiscardCards">
      Discard ({{ discardsLeft }})
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canPlay: boolean;
  canDiscard: boolean;
  handsLeft: number;
  discardsLeft: number;
}>();

const emit = defineEmits<{
  (e: 'play-hand'): void;
  (e: 'discard-cards'): void;
}>();

const onPlayHand = () => {
  emit('play-hand');
};

const onDiscardCards = () => {
  emit('discard-cards');
};
</script>

<style scoped>
/* 스타일은 pages/index.vue 에서 가져옵니다 */
.game-controls {
  margin-top: 20px;
  padding: 15px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #ddd;
  min-height: 50px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.game-controls button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  transition: background-color 0.2s ease;
}

.game-controls button:hover:not(:disabled) {
  background-color: #0056b3;
}

.game-controls button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>