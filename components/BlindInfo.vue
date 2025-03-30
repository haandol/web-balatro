<template>
  <div class="blind-info">
    <h2>{{ name }}</h2>
    <h3>Target: {{ targetScore?.toLocaleString() }}</h3>
    <h4>Current Score: {{ currentScore?.toLocaleString() }}</h4>
  </div>
</template>

<script setup lang="ts">
// 타입 정의 (stores/game.ts 와 일치 또는 import)
interface Blind {
  name: string;
  targetScore: number;
}

defineProps<{
  name?: string | null;
  targetScore?: number | null;
  currentScore?: number | null;
}>();
</script>

<style scoped>
/* 스타일은 pages/index.vue 에서 가져옵니다 */
.blind-info {
  background-color: #e9ecef;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid #ced4da;
}

.blind-info h2 {
  margin: 0 0 5px 0;
  color: #495057;
}

.blind-info h3 {
  margin: 0 0 5px 0;
  color: #dc3545;
  /* 목표 점수 색상 */
  font-size: 1.1em;
}

.blind-info h4 {
  margin: 0;
  color: #28a745;
  /* 현재 점수 색상 */
  font-size: 1.1em;
}
</style>