<script lang="ts" setup>
import { MAX_JOKER_SLOTS } from '~/data/jokers'

const gameStore = useGameStore()
const { jokers } = storeToRefs(gameStore)

const emptySlots = computed(() => MAX_JOKER_SLOTS - jokers.value.length)
</script>

<template>
  <div class="flex items-center justify-center gap-1.5 md:gap-2">
    <JokerCard
      v-for="joker in jokers"
      :key="joker.id"
      :joker="joker"
    />
    <!-- Empty slots -->
    <div
      v-for="i in emptySlots"
      :key="`empty-${i}`"
      class="w-[56px] h-[76px] md:w-[72px] md:h-[96px] rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center"
    >
      <span class="text-white/20 text-lg">+</span>
    </div>
  </div>
</template>
