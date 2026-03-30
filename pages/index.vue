<script lang="ts" setup>
import { evaluateHand, calculateScore } from '~/utils/poker'

const gameStore = useGameStore()
const {
  hand,
  drawPileSize,
  discardPileSize,
  handsRemaining,
  discardsRemaining,
  roundScore,
  targetScore,
  lastHandResult,
  gamePhase,
} = storeToRefs(gameStore)

const selectedCardIds = ref<Set<string>>(new Set())

const selectionCount = computed(() => selectedCardIds.value.size)
const canPlay = computed(
  () => selectionCount.value >= 1 && selectionCount.value <= 5 && handsRemaining.value > 0 && gamePhase.value === 'playing'
)
const canDiscard = computed(
  () => selectionCount.value >= 1 && selectionCount.value <= 5 && discardsRemaining.value > 0 && gamePhase.value === 'playing'
)
const scorePercent = computed(() => Math.min((roundScore.value / targetScore.value) * 100, 100))

// 선택된 카드에 대한 실시간 핸드 프리뷰 (조커 효과 반영)
const handPreview = computed(() => {
  if (selectedCardIds.value.size === 0) return null
  const selectedCards = hand.value.filter((c) => selectedCardIds.value.has(c.id))
  if (selectedCards.length === 0) return null
  const result = evaluateHand(selectedCards)
  const breakdown = calculateScore(result, gameStore.jokers)
  return { ...result, ...breakdown }
})

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
  <main class="min-h-screen bg-felt-dark">
    <!-- Felt texture background -->
    <div class="min-h-screen bg-[radial-gradient(ellipse_at_center,var(--color-felt-light)_0%,var(--color-felt)_50%,var(--color-felt-dark)_100%)]">
      <div class="max-w-lg mx-auto px-3 py-4 md:max-w-3xl md:px-6 md:py-6 flex flex-col min-h-screen">

        <!-- Top Bar: Title + Score -->
        <header class="flex items-center justify-between mb-4">
          <h1 class="font-pixel text-sm md:text-base text-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            BALATRO
          </h1>
          <div class="flex items-center gap-2 text-xs font-pixel">
            <span class="text-gray-400">Ante 1</span>
            <span class="text-gray-500">|</span>
            <span class="text-gray-400">Small Blind</span>
          </div>
        </header>

        <!-- Score Panel -->
        <div class="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-3 mb-4">
          <div class="flex items-end justify-between mb-2">
            <div>
              <div class="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Round Score</div>
              <div
                class="text-3xl md:text-4xl font-bold tabular-nums transition-colors duration-300"
                :class="roundScore >= targetScore ? 'text-green-400' : 'text-white'"
              >
                {{ roundScore.toLocaleString() }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-[10px] uppercase tracking-wider text-gray-500 mb-0.5">Target</div>
              <div class="text-xl md:text-2xl font-bold text-red-400 tabular-nums">
                {{ targetScore.toLocaleString() }}
              </div>
            </div>
          </div>
          <!-- Score bar -->
          <div class="h-2 bg-black/50 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500 ease-out"
              :class="roundScore >= targetScore ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-400'"
              :style="{ width: `${scorePercent}%` }"
            />
          </div>
        </div>

        <!-- Stats Row -->
        <div class="flex items-center justify-center gap-3 mb-4">
          <!-- Hands -->
          <div class="flex items-center gap-1.5 bg-blue-900/40 border border-blue-500/30 rounded-lg px-3 py-1.5">
            <div class="w-2 h-2 rounded-full bg-blue-400" />
            <span class="text-xs text-blue-300">Hands</span>
            <span class="text-sm font-bold text-blue-200 tabular-nums">{{ handsRemaining }}</span>
          </div>
          <!-- Discards -->
          <div class="flex items-center gap-1.5 bg-red-900/40 border border-red-500/30 rounded-lg px-3 py-1.5">
            <div class="w-2 h-2 rounded-full bg-red-400" />
            <span class="text-xs text-red-300">Discards</span>
            <span class="text-sm font-bold text-red-200 tabular-nums">{{ discardsRemaining }}</span>
          </div>
          <!-- Deck -->
          <div class="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
            <span class="text-xs text-gray-400">Deck</span>
            <span class="text-sm font-bold text-gray-200 tabular-nums">{{ drawPileSize }}/{{ drawPileSize + discardPileSize }}</span>
          </div>
        </div>

        <!-- Hand Preview (선택 중) / Last Hand Result (선택 없을 때) -->
        <div
          v-if="gamePhase === 'playing'"
          class="text-center mb-3"
        >
          <!-- 실시간 프리뷰: 카드 선택 시 즉시 핸드 유형 + 예상 점수 표시 -->
          <div
            v-if="handPreview"
            class="inline-flex flex-col items-center gap-1 bg-black/50 border border-blue-400/40 rounded-xl px-5 py-2.5"
          >
            <span class="text-blue-300 font-bold text-base md:text-lg">{{ handPreview.name }}</span>
            <div class="flex items-center gap-3 text-xs">
              <span class="text-blue-200">{{ handPreview.totalChips }} chips</span>
              <span class="text-gray-500">x</span>
              <span class="text-red-300">{{ handPreview.totalMult }} mult</span>
            </div>
            <span class="text-white font-bold text-lg md:text-xl tabular-nums">{{ handPreview.finalScore.toLocaleString() }}</span>
          </div>
          <!-- 마지막 플레이 결과: 선택 없을 때 표시 -->
          <div
            v-else-if="lastHandResult"
            class="inline-flex items-center gap-2 bg-black/40 border border-gold/30 rounded-lg px-4 py-2"
          >
            <span class="text-gold font-bold text-sm md:text-base">{{ lastHandResult.name }}</span>
            <span class="text-white/60">—</span>
            <span class="text-white font-bold text-sm md:text-base">+{{ lastHandResult.finalScore.toLocaleString() }}</span>
          </div>
        </div>

        <!-- Game Over / Won overlay -->
        <div
          v-if="gamePhase !== 'playing'"
          class="flex-1 flex items-center justify-center"
        >
          <div class="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 px-8 py-8 text-center max-w-sm w-full">
            <div
              v-if="gamePhase === 'won'"
              class="mb-4"
            >
              <div class="text-gold font-pixel text-lg mb-2">BLIND CLEAR!</div>
              <div class="text-5xl mb-2">&#127183;</div>
            </div>
            <div
              v-else
              class="mb-4"
            >
              <div class="text-red-400 font-pixel text-lg mb-2">GAME OVER</div>
              <div class="text-5xl mb-2">&#128128;</div>
            </div>
            <div class="text-gray-400 text-sm mb-1">Final Score</div>
            <div class="text-white text-2xl font-bold mb-1">{{ roundScore.toLocaleString() }}</div>
            <div class="text-gray-500 text-sm mb-6">Target: {{ targetScore.toLocaleString() }}</div>
            <button
              class="bg-gold hover:bg-gold-dark text-black font-bold px-8 py-3 rounded-lg transition-colors duration-200 active:scale-95 font-pixel text-xs"
              @click="startNewRun"
            >
              NEW RUN
            </button>
          </div>
        </div>

        <!-- Hand Area (only when playing) -->
        <template v-if="gamePhase === 'playing'">
          <!-- Spacer to push hand to bottom -->
          <div class="flex-1" />

          <!-- Hand -->
          <div class="mb-4">
            <div
              class="flex items-end justify-center"
              :class="hand.length > 6 ? '-space-x-3 md:-space-x-1' : '-space-x-1 md:space-x-1'"
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

          <!-- Action Buttons -->
          <div class="flex items-center justify-center gap-3 pb-4">
            <button
              class="relative px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 overflow-hidden"
              :class="
                canPlay
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/50 active:scale-95'
                  : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
              "
              :disabled="!canPlay"
              @click="playSelected"
            >
              Play Hand
              <span
                v-if="selectionCount > 0"
                class="ml-1 opacity-70"
              >({{ selectionCount }})</span>
            </button>
            <button
              class="relative px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 overflow-hidden"
              :class="
                canDiscard
                  ? 'bg-red-700/80 hover:bg-red-600 text-white shadow-lg shadow-red-900/50 active:scale-95'
                  : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
              "
              :disabled="!canDiscard"
              @click="discardSelected"
            >
              Discard
              <span
                v-if="selectionCount > 0"
                class="ml-1 opacity-70"
              >({{ selectionCount }})</span>
            </button>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
