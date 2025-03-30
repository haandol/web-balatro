<template>
  <div v-if="visible" class="game-over-message">
    <h2>Game Over!</h2>
    <button @click="onRestart">Restart Game</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>();
const emit = defineEmits<{ (e: 'restart'): void }>();

const onRestart = () => {
  emit('restart');
};
</script>

<style scoped>
/* 스타일은 pages/index.vue 에서 가져옵니다 */
.game-over-message {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border-radius: 8px;
}

.game-over-message h2 {
  color: white;
  margin-bottom: 20px;
}

.game-over-message button {
  padding: 10px 20px;
  font-size: 1.1em;
  cursor: pointer;
}
</style>