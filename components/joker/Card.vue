<script lang="ts" setup>
import type { Joker } from '~/types/joker'
import { EDITIONS } from '~/data/cardModifiers'

const props = defineProps<{
  joker: Joker
}>()

const showTooltip = ref(false)

const rarityColor = computed(() => {
  switch (props.joker.rarity) {
    case 'common':
      return 'border-blue-500/50 bg-blue-950/80'
    case 'uncommon':
      return 'border-green-500/50 bg-green-950/80'
    case 'rare':
      return 'border-red-500/50 bg-red-950/80'
  }
})

const rarityLabel = computed(() => {
  switch (props.joker.rarity) {
    case 'common':
      return 'text-blue-400'
    case 'uncommon':
      return 'text-green-400'
    case 'rare':
      return 'text-red-400'
  }
})

const editionClass = computed(() => {
  const e = props.joker.edition
  if (!e || e === 'base') return ''
  switch (e) {
    case 'foil':
      return 'edition-foil'
    case 'holographic':
      return 'edition-holographic'
    case 'polychrome':
      return 'edition-polychrome'
    case 'negative':
      return 'edition-negative'
    default:
      return ''
  }
})

const editionName = computed(() => {
  const e = props.joker.edition
  if (!e || e === 'base') return null
  return EDITIONS[e].name
})
</script>

<template>
  <div class="relative">
    <button
      class="w-[56px] h-[76px] md:w-[72px] md:h-[96px] rounded-lg border-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all duration-150 hover:scale-105 hover:shadow-lg"
      :class="[rarityColor, editionClass]"
      @mouseenter="showTooltip = true"
      @mouseleave="showTooltip = false"
      @click="showTooltip = !showTooltip"
    >
      <span class="text-xl md:text-2xl">&#129313;</span>
      <span class="text-[7px] md:text-[8px] text-white/90 font-bold leading-tight text-center px-1 line-clamp-2">
        {{ joker.name }}
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
        @click="showTooltip = false"
      >
        <div class="text-sm font-bold text-white mb-1">{{ joker.name }}</div>
        <div
          class="text-[10px] uppercase tracking-wider mb-1"
          :class="rarityLabel"
        >
          {{ joker.rarity }}
        </div>
        <div
          v-if="editionName"
          class="text-[10px] text-purple-300 mb-1"
        >
          {{ editionName }}
        </div>
        <div
          v-if="joker.eternal"
          class="text-[10px] text-amber-300 mb-1"
        >
          Eternal
        </div>
        <div class="text-xs text-gray-300">{{ joker.description }}</div>
      </div>
    </Transition>
  </div>
</template>
