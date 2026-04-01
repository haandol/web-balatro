<script lang="ts" setup>
const gameStore = useGameStore()
const { jokers, maxJokerSlots, gamePhase } = storeToRefs(gameStore)

const emptySlots = computed(() => Math.max(0, maxJokerSlots.value - jokers.value.length))
const isShop = computed(() => gamePhase.value === 'shop')

function handleSell(jokerId: string) {
  gameStore.sellJoker(jokerId)
}
</script>

<template>
  <div class="flex items-center justify-center gap-1.5 md:gap-2">
    <JokerCard
      v-for="joker in jokers"
      :key="joker.id"
      :joker="joker"
      :sellable="isShop"
      @sell="handleSell"
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
