<script lang="ts" setup>
const gameStore = useGameStore()
const {
  hand,
  drawPileSize,
  discardPileSize,
  totalCards,
  handsRemaining,
  discardsRemaining,
  roundScore,
  targetScore,
  lastHandResult,
  gamePhase,
} = storeToRefs(gameStore)

const selectedCardIds = ref<Set<string>>(new Set())

const selectionCount = computed(() => selectedCardIds.value.size)
const canPlay = computed(() => selectionCount.value >= 1 && selectionCount.value <= 5 && handsRemaining.value > 0 && gamePhase.value === 'playing')
const canDiscard = computed(() => selectionCount.value >= 1 && selectionCount.value <= 5 && discardsRemaining.value > 0 && gamePhase.value === 'playing')

function toggleCard(cardId: string) {
  if (gamePhase.value !== 'playing') return
  if (selectedCardIds.value.has(cardId)) {
    selectedCardIds.value = new Set([...selectedCardIds.value].filter((id) => id !== cardId))
  } else if (selectedCardIds.value.size < 5) {
    selectedCardIds.value = new Set([...selectedCardIds.value, cardId])
  }
}

function playSelected() {
  if (!canPlay.value) return
  gameStore.playHand([...selectedCardIds.value])
  selectedCardIds.value = new Set()
}

function discardSelected() {
  if (!canDiscard.value) return
  gameStore.discardCards([...selectedCardIds.value])
  selectedCardIds.value = new Set()
}

function startNewRun() {
  gameStore.initDeck()
  selectedCardIds.value = new Set()
}

onMounted(() => {
  gameStore.initDeck()
})
</script>

<template>
  <main class="min-h-screen bg-[#1a3a24] text-gray-100">
    <div class="max-w-lg mx-auto px-2 py-4 md:max-w-4xl md:px-4">
      <!-- Header -->
      <div class="text-center mb-4">
        <h1 class="text-xl md:text-2xl font-bold text-yellow-400 font-['Press_Start_2P']">Web Balatro</h1>
      </div>

      <!-- Score & Round Info -->
      <div class="bg-[#234a30] rounded-lg px-4 py-3 mb-4">
        <div class="flex items-center justify-between mb-2">
          <div class="text-sm text-gray-400">Score</div>
          <div class="text-sm text-gray-400">Target</div>
        </div>
        <div class="flex items-center justify-between">
          <span
            class="text-2xl font-bold"
            :class="roundScore >= targetScore ? 'text-green-400' : 'text-yellow-400'"
          >{{ roundScore }}</span>
          <span class="text-lg text-gray-300">/ {{ targetScore }}</span>
        </div>
        <!-- Progress bar -->
        <div class="mt-2 h-2 bg-[#1a3a24] rounded-full overflow-hidden">
          <div
            class="h-full bg-yellow-500 rounded-full transition-all duration-300"
            :style="{ width: `${Math.min((roundScore / targetScore) * 100, 100)}%` }"
          />
        </div>
      </div>

      <!-- Hands / Discards / Deck Info -->
      <div class="flex items-center justify-center gap-4 mb-4 text-sm">
        <div class="flex flex-col items-center">
          <span class="text-gray-400">Hands</span>
          <span
            class="text-lg font-bold"
            :class="handsRemaining > 0 ? 'text-blue-400' : 'text-red-400'"
          >{{ handsRemaining }}</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-gray-400">Discards</span>
          <span
            class="text-lg font-bold"
            :class="discardsRemaining > 0 ? 'text-orange-400' : 'text-red-400'"
          >{{ discardsRemaining }}</span>
        </div>
        <div class="w-px h-8 bg-gray-600" />
        <div class="flex flex-col items-center">
          <span class="text-gray-400">Draw</span>
          <span class="text-lg font-bold text-blue-400">{{ drawPileSize }}</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-gray-400">Discard</span>
          <span class="text-lg font-bold text-red-400">{{ discardPileSize }}</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-gray-400">Total</span>
          <span class="text-lg font-bold text-gray-200">{{ totalCards }}</span>
        </div>
      </div>

      <!-- Last Hand Result -->
      <div
        v-if="lastHandResult"
        class="text-center mb-4"
      >
        <span class="text-yellow-300 font-bold text-lg">{{ lastHandResult.name }}</span>
        <span class="text-gray-300 ml-2">+{{ lastHandResult.score }}</span>
      </div>

      <!-- Game Over / Won overlay -->
      <div
        v-if="gamePhase !== 'playing'"
        class="bg-black/70 rounded-xl p-6 mb-4 text-center"
      >
        <div
          v-if="gamePhase === 'won'"
          class="text-green-400 text-2xl font-bold mb-2"
        >
          Blind Clear!
        </div>
        <div
          v-else
          class="text-red-400 text-2xl font-bold mb-2"
        >
          Game Over
        </div>
        <div class="text-gray-300 mb-4">
          Score: {{ roundScore }} / {{ targetScore }}
        </div>
        <button
          class="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold px-6 py-3 rounded-lg transition-colors duration-200 active:scale-95"
          @click="startNewRun"
        >
          New Run
        </button>
      </div>

      <!-- Hand Area -->
      <div class="bg-[#2d5a3a] rounded-xl p-4 mb-4 min-h-[120px] md:min-h-[160px]">
        <div
          class="flex items-end justify-center -space-x-2 md:-space-x-1"
          role="list"
          aria-label="Player hand"
        >
          <div
            v-for="card in hand"
            :key="card.id"
            role="listitem"
          >
            <CardPlayingCard
              :card="card"
              :selected="selectedCardIds.has(card.id)"
              @click="toggleCard(card.id)"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div
        v-if="gamePhase === 'playing'"
        class="flex items-center justify-center gap-3"
      >
        <button
          class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          :class="canPlay ? 'hover:bg-blue-500 active:scale-95' : 'opacity-50 cursor-not-allowed'"
          :disabled="!canPlay"
          @click="playSelected"
        >
          Play Hand ({{ selectionCount }})
        </button>
        <button
          class="bg-transparent text-gray-200 px-6 py-3 rounded-lg font-semibold border border-gray-500 transition-colors duration-200"
          :class="canDiscard ? 'hover:border-gray-300' : 'opacity-50 cursor-not-allowed'"
          :disabled="!canDiscard"
          @click="discardSelected"
        >
          Discard ({{ selectionCount }})
        </button>
      </div>
    </div>
  </main>
</template>
