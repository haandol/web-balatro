<template>
  <div v-if="visible"
    class="absolute inset-0 bg-black/70 text-white flex flex-col justify-center items-center z-10 rounded-lg backdrop-blur-sm">
    <div class="bg-gray-800/90 p-8 rounded-xl shadow-2xl transform transition-all duration-300 scale-100">
      <h2
        class="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
        Game Over!
      </h2>
      <button @click="onRestart"
        class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:from-yellow-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50">
        Restart Game
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean }>();
const emit = defineEmits<{ (e: 'restart'): void }>();

const onRestart = () => {
  emit('restart');
};
</script>