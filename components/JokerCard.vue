<template>
  <div class="joker-card" @click="handleClick">
    <div class="joker-content">
      <div class="joker-name">{{ joker.name }}</div>
      <div class="joker-image">
        <span class="joker-icon">🃏</span>
      </div>
      <div class="joker-effect">{{ joker.description }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Joker } from '@/utils/joker';

// Props 정의
const props = defineProps<{
  joker: Joker;
  index: number;
}>();

// Emits 정의
const emit = defineEmits<{
  (e: 'select', joker: Joker, index: number): void;
}>();

// 클릭 이벤트 핸들러
const handleClick = () => {
  emit('select', props.joker, props.index);
};
</script>

<style scoped>
.joker-card {
  width: 90px;
  height: 120px;
  background-color: #280b38;
  /* 어두운 보라색 배경 */
  border: 3px solid #ffd700;
  /* 금색 테두리 */
  border-radius: 8px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  padding: 5px;
  margin: 5px;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: 'Press Start 2P', monospace, sans-serif;
  /* 픽셀 아트 느낌의 폰트 */
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
  position: relative;
  overflow: hidden;
}

.joker-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
}

.joker-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.joker-name {
  font-size: 10px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.joker-image {
  width: 60px;
  height: 60px;
  background-color: #5d2a8e;
  /* 밝은 보라색 */
  border-radius: 4px;
  margin: 3px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.joker-icon {
  font-size: 32px;
}

.joker-effect {
  font-size: 7px;
  text-align: center;
  margin-top: 5px;
  line-height: 1.2;
  height: 28px;
  overflow: hidden;
  padding: 0 4px;
}

/* 픽셀화된 테두리 효과 */
.joker-card::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border: 1px dashed rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  pointer-events: none;
}
</style>