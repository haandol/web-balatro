<script lang="ts" setup>
import type { PlayingCard } from '~/types/card'

const props = defineProps<{
  card: PlayingCard
  selected?: boolean
  debuffed?: boolean
}>()

defineEmits<{
  click: []
}>()

const suitSymbol: Record<string, string> = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
}

const isRed = computed(() => props.card.suit === 'hearts' || props.card.suit === 'diamonds')
</script>

<template>
  <button
    class="playing-card group relative flex flex-col items-center justify-between cursor-pointer select-none transition-all duration-150"
    :class="[selected ? 'is-selected' : '', debuffed ? 'opacity-40 grayscale' : '']"
    :aria-label="`${card.rank} of ${card.suit}`"
    @click="$emit('click')"
  >
    <!-- Card body -->
    <div
      class="relative w-[52px] h-[76px] md:w-[72px] md:h-[100px] rounded-lg border-2 overflow-hidden"
      :class="[
        selected
          ? 'border-gold shadow-[0_0_12px_rgba(255,215,0,0.5)] bg-gradient-to-b from-white to-amber-50'
          : 'border-gray-300/80 bg-gradient-to-b from-white to-gray-50 group-hover:border-gray-400 group-hover:shadow-md',
      ]"
    >
      <!-- Top-left rank + suit -->
      <div class="absolute top-1 left-1.5 flex flex-col items-center leading-none">
        <span
          class="text-[11px] md:text-sm font-bold"
          :class="isRed ? 'text-red-600' : 'text-gray-900'"
          >{{ card.rank }}</span
        >
        <span
          class="text-[10px] md:text-xs -mt-0.5"
          :class="isRed ? 'text-red-500' : 'text-gray-700'"
          >{{ suitSymbol[card.suit] }}</span
        >
      </div>

      <!-- Center suit (large) -->
      <div class="absolute inset-0 flex items-center justify-center">
        <span
          class="text-2xl md:text-3xl drop-shadow-sm"
          :class="isRed ? 'text-red-500' : 'text-gray-800'"
          >{{ suitSymbol[card.suit] }}</span
        >
      </div>

      <!-- Bottom-right rank + suit (inverted) -->
      <div class="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
        <span
          class="text-[11px] md:text-sm font-bold"
          :class="isRed ? 'text-red-600' : 'text-gray-900'"
          >{{ card.rank }}</span
        >
        <span
          class="text-[10px] md:text-xs -mt-0.5"
          :class="isRed ? 'text-red-500' : 'text-gray-700'"
          >{{ suitSymbol[card.suit] }}</span
        >
      </div>

      <!-- Shine effect -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"
      />
    </div>
  </button>
</template>

<style scoped>
.playing-card {
  transform: translateY(0);
  filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
}

.playing-card:hover:not(.is-selected) {
  transform: translateY(-6px);
  filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.4));
}

.playing-card.is-selected {
  transform: translateY(-16px);
  filter: drop-shadow(0 8px 12px rgba(255, 215, 0, 0.3));
}
</style>
