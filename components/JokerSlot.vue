<template>
  <div class="joker-slot-container">
    <h3 class="joker-slot-title">조커 슬롯</h3>
    <div class="joker-slots">
      <div v-for="(joker, index) in activeJokers" :key="joker.id" class="joker-slot">
        <JokerCard :joker="joker" :index="index" @select="onJokerSelect" />
      </div>
      <!-- 빈 슬롯 표시 -->
      <div v-for="i in emptySlots" :key="`empty-${i}`" class="joker-slot empty">
        <div class="empty-slot">비어있음</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import JokerCard from './JokerCard.vue';
import type { Joker } from '@/utils/joker';

// Props 정의
const props = defineProps<{
  activeJokers: Joker[];
  maxSlots: number;
}>();

// 이벤트 정의
const emit = defineEmits<{
  (e: 'selectJoker', joker: Joker, index: number): void;
}>();

// 비어있는 슬롯 수 계산
const emptySlots = computed(() => {
  return Math.max(0, props.maxSlots - props.activeJokers.length);
});

// 조커 선택 이벤트 핸들러
const onJokerSelect = (joker: Joker, index: number) => {
  emit('selectJoker', joker, index);
};
</script>

<style scoped>
.joker-slot-container {
  width: 100%;
  padding: 10px;
  background-color: #1e1e1e;
  border-radius: 8px;
  border: 2px solid #444;
  margin-bottom: 20px;
}

.joker-slot-title {
  font-family: 'Press Start 2P', monospace, sans-serif;
  color: #ffd700;
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 14px;
  text-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);
}

.joker-slots {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  padding: 5px;
}

.joker-slot {
  width: 90px;
  height: 120px;
  margin: 0 5px;
}

.empty-slot {
  width: 90px;
  height: 120px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px dashed #444;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
  font-size: 10px;
  font-family: 'Press Start 2P', monospace, sans-serif;
}
</style>