<script lang="ts" setup>
import type { ConsumableCard } from '~/types/consumable'

const props = defineProps<{
  card: ConsumableCard
  canUse?: boolean
}>()

const emit = defineEmits<{
  use: [id: string]
  sell: [id: string]
}>()

const showTooltip = ref(false)

const typeColor = computed(() => {
  switch (props.card.type) {
    case 'tarot':
      return 'border-purple-500/50 bg-purple-950/80'
    case 'planet':
      return 'border-cyan-500/50 bg-cyan-950/80'
    case 'spectral':
      return 'border-blue-400/50 bg-blue-950/80'
  }
})

const typeLabel = computed(() => {
  switch (props.card.type) {
    case 'tarot':
      return 'text-purple-400'
    case 'planet':
      return 'text-cyan-400'
    case 'spectral':
      return 'text-blue-300'
  }
})

const typeIcon = computed(() => {
  switch (props.card.type) {
    case 'tarot':
      return '\u2605'
    case 'planet':
      return '\uD83C\uDF0D'
    case 'spectral':
      return '\uD83D\uDC7B'
  }
})

function handleUse() {
  emit('use', props.card.id)
  showTooltip.value = false
}

function handleSell() {
  emit('sell', props.card.id)
  showTooltip.value = false
}
</script>

<template>
  <div class="relative">
    <button
      class="w-[56px] h-[76px] md:w-[72px] md:h-[96px] rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all duration-150 hover:scale-105 hover:shadow-lg"
      :class="typeColor"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      @click="showTooltip = !showTooltip"
    >
      <span class="text-xl md:text-2xl">{{ typeIcon }}</span>
      <span class="text-[7px] md:text-[8px] text-white/90 font-bold leading-tight text-center px-1 line-clamp-2">
        {{ card.name }}
      </span>
    </button>

    <!-- Tooltip -->
    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showTooltip"
        class="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 w-48 bg-gray-900 border border-white/20 rounded-lg px-3 py-2 shadow-xl"
        @click.stop
      >
        <div class="text-sm font-bold text-white mb-1">{{ card.name }}</div>
        <div
          class="text-[10px] uppercase tracking-wider mb-1"
          :class="typeLabel"
        >
          {{ card.type }}
        </div>
        <div class="text-xs text-gray-300 mb-2">{{ card.description }}</div>
        <div class="flex items-center gap-1.5">
          <button
            v-if="canUse"
            class="flex-1 text-[10px] px-2 py-1 rounded font-bold bg-green-600 hover:bg-green-500 text-white transition-all duration-150 active:scale-95"
            @click="handleUse"
          >
            USE
          </button>
          <button
            class="flex-1 text-[10px] px-2 py-1 rounded font-bold bg-yellow-700 hover:bg-yellow-600 text-white transition-all duration-150 active:scale-95"
            @click="handleSell"
          >
            SELL ${{ card.sellPrice }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
