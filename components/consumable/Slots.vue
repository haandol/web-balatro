<script lang="ts" setup>
const gameStore = useGameStore()
const { consumables, consumableSlots, gamePhase } = storeToRefs(gameStore)

const emptySlots = computed(() => Math.max(0, consumableSlots.value - consumables.value.length))
const canUse = computed(() => gamePhase.value === 'playing')
</script>

<template>
  <div class="flex items-center justify-center gap-1.5 md:gap-2">
    <ConsumableCard
      v-for="card in consumables"
      :key="card.id"
      :card="card"
      :can-use="canUse"
      @use="gameStore.removeConsumable($event)"
      @sell="gameStore.sellConsumable($event)"
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
