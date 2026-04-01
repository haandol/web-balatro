<script lang="ts" setup>
import { evaluateHand, calculateScore } from '~/utils/poker'
import { BLIND_LABELS, getTargetScore } from '~/data/blinds'
import { isDebuffed } from '~/utils/boss'
import { PACK_TYPE_NAMES, PACK_SIZE_LABELS } from '~/data/boosterPacks'

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
  currentAnte,
  currentBlind,
  money,
  lastEarnings,
  shopJokers,
  rerollCost,
  jokers,
  currentBoss,
  activeBossModifier,
  maxJokerSlots,
  lastSkipTag,
  freeRerolls,
  runStats,
  shopPacks,
  openPack,
} = storeToRefs(gameStore)

const hasSavedGame = ref(false)
const selectedCardIds = ref<Set<string>>(new Set())

const selectionCount = computed(() => selectedCardIds.value.size)
const canPlay = computed(() => {
  if (gamePhase.value !== 'playing' || handsRemaining.value <= 0) return false
  if (selectionCount.value < 1 || selectionCount.value > 5) return false
  const mod = activeBossModifier.value
  if (mod?.type === 'force_hand_size') return selectionCount.value === mod.size
  return true
})
const canDiscard = computed(
  () =>
    selectionCount.value >= 1 &&
    selectionCount.value <= 5 &&
    discardsRemaining.value > 0 &&
    gamePhase.value === 'playing'
)
const scorePercent = computed(() => {
  if (targetScore.value === 0) return 0
  return Math.min((roundScore.value / targetScore.value) * 100, 100)
})

// 선택된 카드에 대한 실시간 핸드 프리뷰 (조커 효과 반영)
const handPreview = computed(() => {
  if (selectedCardIds.value.size === 0) return null
  const selectedCards = hand.value.filter((c) => selectedCardIds.value.has(c.id))
  if (selectedCards.length === 0) return null
  const result = evaluateHand(selectedCards, gameStore.handLevels)
  const breakdown = calculateScore(result, gameStore.jokers, activeBossModifier.value)
  return { ...result, ...breakdown }
})

const blindLabel = computed(() => BLIND_LABELS[currentBlind.value])

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

function handleStartBlind() {
  gameStore.startBlind()
  selectedCardIds.value = new Set()
}

function handleOpenShop() {
  gameStore.openShop()
}

function startNewRun() {
  gameStore.initRun()
  selectedCardIds.value = new Set()
  hasSavedGame.value = false
}

function handleContinue() {
  if (gameStore.continueRun()) {
    selectedCardIds.value = new Set()
    hasSavedGame.value = false
  }
}

function getJokerPrice(joker: { sellPrice: number }) {
  return joker.sellPrice * 2
}

function isCardDebuffed(card: { suit: string; rank: string }) {
  return isDebuffed(card as import('~/types/card').PlayingCard, activeBossModifier.value)
}

onMounted(() => {
  hasSavedGame.value = gameStore.checkForSave()
  if (!hasSavedGame.value) {
    gameStore.initRun()
  }
})
</script>

<template>
  <main class="min-h-screen bg-felt-dark">
    <!-- Felt texture background -->
    <div
      class="min-h-screen bg-[radial-gradient(ellipse_at_center,var(--color-felt-light)_0%,var(--color-felt)_50%,var(--color-felt-dark)_100%)]"
    >
      <div class="max-w-lg mx-auto px-3 py-4 md:max-w-3xl md:px-6 md:py-6 flex flex-col min-h-screen">
        <!-- Top Bar: Title + Money + Ante/Blind -->
        <header
          v-if="gamePhase !== 'menu'"
          class="flex items-center justify-between mb-4"
        >
          <h1 class="font-pixel text-sm md:text-base text-gold drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">BALATRO</h1>
          <div class="flex items-center gap-3 text-xs font-pixel">
            <span class="text-gold font-bold">${{ money }}</span>
            <span class="text-gray-600">|</span>
            <span class="text-gray-400">Ante {{ currentAnte }}</span>
            <span class="text-gray-600">|</span>
            <span class="text-gray-400">{{ blindLabel }}</span>
          </div>
        </header>

        <!-- Joker Slots -->
        <div
          v-if="gamePhase !== 'menu'"
          class="mb-2"
        >
          <JokerSlots />
        </div>

        <!-- Consumable Slots -->
        <div
          v-if="gamePhase !== 'menu'"
          class="mb-4"
        >
          <ConsumableSlots />
        </div>

        <!-- ===== MENU PHASE ===== -->
        <template v-if="gamePhase === 'menu'">
          <div class="flex-1 flex items-center justify-center">
            <div class="text-center">
              <h1 class="font-pixel text-3xl md:text-5xl text-gold drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] mb-2">
                BALATRO
              </h1>
              <div class="text-gray-500 text-sm mb-10">Web Edition</div>
              <div class="flex flex-col items-center gap-3">
                <button
                  v-if="hasSavedGame"
                  class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-12 py-3 rounded-lg transition-all duration-200 active:scale-95 font-pixel text-sm shadow-lg shadow-blue-900/50 w-48"
                  @click="handleContinue"
                >
                  CONTINUE
                </button>
                <button
                  class="bg-gold hover:bg-gold-dark text-black font-bold px-12 py-3 rounded-lg transition-all duration-200 active:scale-95 font-pixel text-sm w-48"
                  @click="startNewRun"
                >
                  NEW RUN
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== BLIND SELECT PHASE ===== -->
        <template v-else-if="gamePhase === 'blind_select'">
          <div class="flex-1 flex items-center justify-center">
            <div
              class="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 px-8 py-8 text-center max-w-sm w-full"
            >
              <div class="text-gold font-pixel text-base mb-1">ANTE {{ currentAnte }}</div>
              <div class="text-white font-pixel text-lg mb-2">{{ blindLabel }}</div>

              <!-- Boss blind info -->
              <div
                v-if="currentBlind === 'boss' && currentBoss"
                class="mb-4"
              >
                <div class="text-red-400 font-bold text-sm">{{ currentBoss.name }}</div>
                <div class="text-red-300/70 text-xs">{{ currentBoss.description }}</div>
              </div>
              <div
                v-else
                class="mb-4"
              />

              <div class="bg-white/5 rounded-xl px-5 py-4 mb-6">
                <div class="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Target Score</div>
                <div class="text-3xl font-bold text-red-400 tabular-nums">
                  {{ getTargetScore(currentAnte, currentBlind).toLocaleString() }}
                </div>
              </div>

              <div class="flex items-center justify-center gap-3">
                <button
                  class="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-3 rounded-lg transition-all duration-200 active:scale-95 font-pixel text-xs shadow-lg shadow-blue-900/50"
                  @click="handleStartBlind"
                >
                  PLAY
                </button>
                <button
                  v-if="currentBlind !== 'boss'"
                  class="bg-gray-600 hover:bg-gray-500 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 active:scale-95 font-pixel text-xs"
                  @click="gameStore.skipBlind()"
                >
                  SKIP
                </button>
              </div>

              <!-- Skip tag reward notification -->
              <div
                v-if="lastSkipTag"
                class="mt-4 bg-green-900/40 border border-green-500/30 rounded-lg px-4 py-2 text-sm"
              >
                <span class="text-green-300 font-bold">{{ lastSkipTag.name }}</span>
                <span class="text-green-200/70 ml-2">{{ lastSkipTag.description }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== PLAYING PHASE ===== -->
        <template v-else-if="gamePhase === 'playing'">
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
            <div class="flex items-center gap-1.5 bg-blue-900/40 border border-blue-500/30 rounded-lg px-3 py-1.5">
              <div class="w-2 h-2 rounded-full bg-blue-400" />
              <span class="text-xs text-blue-300">Hands</span>
              <span class="text-sm font-bold text-blue-200 tabular-nums">{{ handsRemaining }}</span>
            </div>
            <div class="flex items-center gap-1.5 bg-red-900/40 border border-red-500/30 rounded-lg px-3 py-1.5">
              <div class="w-2 h-2 rounded-full bg-red-400" />
              <span class="text-xs text-red-300">Discards</span>
              <span class="text-sm font-bold text-red-200 tabular-nums">{{ discardsRemaining }}</span>
            </div>
            <div class="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5">
              <span class="text-xs text-gray-400">Deck</span>
              <span class="text-sm font-bold text-gray-200 tabular-nums"
                >{{ drawPileSize }}/{{ drawPileSize + discardPileSize }}</span
              >
            </div>
          </div>

          <!-- Boss modifier banner -->
          <div
            v-if="currentBlind === 'boss' && currentBoss"
            class="flex items-center justify-center gap-2 mb-3 bg-red-900/30 border border-red-500/30 rounded-lg px-3 py-1.5"
          >
            <span class="text-red-400 font-bold text-xs">{{ currentBoss.name }}</span>
            <span class="text-red-300/60 text-xs">{{ currentBoss.description }}</span>
          </div>

          <!-- Hand Preview / Last Hand Result -->
          <div class="text-center mb-3">
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
              <span class="text-white font-bold text-lg md:text-xl tabular-nums">{{
                handPreview.finalScore.toLocaleString()
              }}</span>
            </div>
            <div
              v-else-if="lastHandResult"
              class="inline-flex items-center gap-2 bg-black/40 border border-gold/30 rounded-lg px-4 py-2"
            >
              <span class="text-gold font-bold text-sm md:text-base">{{ lastHandResult.name }}</span>
              <span class="text-white/60">—</span>
              <span class="text-white font-bold text-sm md:text-base"
                >+{{ lastHandResult.finalScore.toLocaleString() }}</span
              >
            </div>
          </div>

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
                <CardPlaying
                  :card="card"
                  :selected="selectedCardIds.has(card.id)"
                  :debuffed="isCardDebuffed(card)"
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
                >({{ selectionCount }})</span
              >
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
                >({{ selectionCount }})</span
              >
            </button>
          </div>
        </template>

        <!-- ===== ROUND END PHASE ===== -->
        <template v-else-if="gamePhase === 'round_end'">
          <div class="flex-1 flex items-center justify-center">
            <div
              class="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 px-8 py-8 text-center max-w-sm w-full"
            >
              <div class="text-green-400 font-pixel text-lg mb-2">BLIND CLEAR!</div>
              <div class="text-5xl mb-4">&#127183;</div>

              <div class="text-gray-400 text-sm mb-1">Score</div>
              <div class="text-white text-2xl font-bold mb-4">{{ roundScore.toLocaleString() }}</div>

              <!-- Earnings breakdown -->
              <div
                v-if="lastEarnings"
                class="bg-gold/10 border border-gold/30 rounded-xl px-5 py-3 mb-6"
              >
                <div class="text-[10px] uppercase tracking-wider text-gold/70 mb-2">Earnings</div>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-400">Blind reward</span>
                    <span class="text-gold tabular-nums">${{ lastEarnings.blindReward }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Hand bonus</span>
                    <span class="text-gold tabular-nums">${{ lastEarnings.handBonus }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-400">Interest</span>
                    <span class="text-gold tabular-nums">${{ lastEarnings.interest }}</span>
                  </div>
                  <div class="border-t border-gold/20 pt-1 flex justify-between font-bold">
                    <span class="text-gold">Total</span>
                    <span class="text-gold tabular-nums">${{ lastEarnings.total }}</span>
                  </div>
                </div>
              </div>

              <button
                class="bg-gold hover:bg-gold-dark text-black font-bold px-10 py-3 rounded-lg transition-all duration-200 active:scale-95 font-pixel text-xs"
                @click="handleOpenShop"
              >
                SHOP
              </button>
            </div>
          </div>
        </template>

        <!-- ===== SHOP PHASE ===== -->
        <template v-else-if="gamePhase === 'shop'">
          <div class="flex-1 flex items-center justify-center">
            <div
              class="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 px-6 py-6 text-center max-w-md w-full"
            >
              <div class="text-gold font-pixel text-lg mb-4">SHOP</div>

              <!-- Shop Jokers -->
              <div class="mb-6">
                <div class="text-[10px] uppercase tracking-wider text-gray-500 mb-3">Jokers</div>
                <div
                  v-if="shopJokers.length > 0"
                  class="flex justify-center gap-4"
                >
                  <div
                    v-for="(joker, index) in shopJokers"
                    :key="joker.id"
                    class="flex flex-col items-center gap-2"
                  >
                    <JokerCard :joker="joker" />
                    <div class="text-xs text-gray-400">${{ getJokerPrice(joker) }}</div>
                    <button
                      class="text-xs px-3 py-1 rounded font-bold transition-all duration-150"
                      :class="
                        money >= getJokerPrice(joker) && jokers.length < maxJokerSlots
                          ? 'bg-green-600 hover:bg-green-500 text-white active:scale-95'
                          : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      "
                      :disabled="money < getJokerPrice(joker) || jokers.length >= maxJokerSlots"
                      @click="gameStore.buyJoker(index)"
                    >
                      BUY
                    </button>
                  </div>
                </div>
                <div
                  v-else
                  class="text-gray-600 text-sm py-4"
                >
                  Sold out
                </div>
              </div>

              <!-- Booster Packs -->
              <div class="mb-6">
                <div class="text-[10px] uppercase tracking-wider text-gray-500 mb-3">Booster Packs</div>
                <div
                  v-if="shopPacks.length > 0"
                  class="flex justify-center gap-4"
                >
                  <div
                    v-for="(pack, index) in shopPacks"
                    :key="pack.id"
                    class="flex flex-col items-center gap-2"
                  >
                    <div
                      class="w-16 h-22 rounded-lg border-2 flex flex-col items-center justify-center text-center px-1"
                      :class="{
                        'border-purple-500/60 bg-purple-900/40': pack.type === 'arcana',
                        'border-cyan-500/60 bg-cyan-900/40': pack.type === 'celestial',
                        'border-blue-500/60 bg-blue-900/40': pack.type === 'spectral',
                      }"
                    >
                      <div
                        class="text-[10px] font-bold leading-tight"
                        :class="{
                          'text-purple-300': pack.type === 'arcana',
                          'text-cyan-300': pack.type === 'celestial',
                          'text-blue-300': pack.type === 'spectral',
                        }"
                      >
                        {{ PACK_SIZE_LABELS[pack.size] }}
                      </div>
                      <div
                        class="text-[9px] leading-tight mt-0.5"
                        :class="{
                          'text-purple-400': pack.type === 'arcana',
                          'text-cyan-400': pack.type === 'celestial',
                          'text-blue-400': pack.type === 'spectral',
                        }"
                      >
                        {{ PACK_TYPE_NAMES[pack.type] }}
                      </div>
                      <div class="text-[8px] text-gray-500 mt-1">{{ pack.totalCards }} cards</div>
                      <div class="text-[8px] text-gray-500">pick {{ pack.selectCount }}</div>
                    </div>
                    <div class="text-xs text-gray-400">${{ pack.cost }}</div>
                    <button
                      class="text-xs px-3 py-1 rounded font-bold transition-all duration-150"
                      :class="
                        money >= pack.cost
                          ? 'bg-green-600 hover:bg-green-500 text-white active:scale-95'
                          : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      "
                      :disabled="money < pack.cost"
                      @click="gameStore.buyPack(index)"
                    >
                      BUY
                    </button>
                  </div>
                </div>
                <div
                  v-else
                  class="text-gray-600 text-sm py-4"
                >
                  Sold out
                </div>
              </div>

              <!-- Reroll & Leave -->
              <div class="flex items-center justify-center gap-3">
                <button
                  class="px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200"
                  :class="
                    freeRerolls > 0 || money >= rerollCost
                      ? 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
                      : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  "
                  :disabled="freeRerolls <= 0 && money < rerollCost"
                  @click="gameStore.rerollShop()"
                >
                  {{ freeRerolls > 0 ? `Reroll (FREE x${freeRerolls})` : `Reroll ($${rerollCost})` }}
                </button>
                <button
                  class="bg-gold hover:bg-gold-dark text-black font-bold px-5 py-2.5 rounded-lg transition-all duration-200 active:scale-95 font-pixel text-xs"
                  @click="gameStore.leaveShop()"
                >
                  NEXT ROUND
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- ===== PACK OPENING OVERLAY ===== -->
        <div
          v-if="openPack"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <div class="bg-gray-900/95 border border-white/10 rounded-2xl px-6 py-6 text-center max-w-md w-full mx-4">
            <div
              class="font-pixel text-base mb-1"
              :class="{
                'text-purple-400': openPack.pack.type === 'arcana',
                'text-cyan-400': openPack.pack.type === 'celestial',
                'text-blue-400': openPack.pack.type === 'spectral',
              }"
            >
              {{ PACK_SIZE_LABELS[openPack.pack.size] }} {{ PACK_TYPE_NAMES[openPack.pack.type] }}
            </div>
            <div class="text-gray-400 text-xs mb-4">
              Choose {{ openPack.selectionsRemaining }} card{{ openPack.selectionsRemaining > 1 ? 's' : '' }}
            </div>

            <!-- Pack cards -->
            <div class="flex justify-center gap-3 mb-5">
              <button
                v-for="card in openPack.cards"
                :key="card.id"
                class="w-20 h-28 rounded-lg border-2 flex flex-col items-center justify-center text-center px-1.5 transition-all duration-150"
                :class="
                  openPack.selectedIds.includes(card.id)
                    ? 'border-gold bg-gold/20 -translate-y-2 shadow-lg shadow-gold/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                "
                @click="gameStore.selectPackCard(card.id)"
              >
                <div
                  class="text-[10px] font-bold"
                  :class="{
                    'text-purple-300': card.type === 'tarot',
                    'text-cyan-300': card.type === 'planet',
                    'text-blue-300': card.type === 'spectral',
                  }"
                >
                  {{ card.name }}
                </div>
                <div class="text-[8px] text-gray-400 mt-1 leading-tight">
                  {{ card.description }}
                </div>
              </button>
            </div>

            <!-- Skip button -->
            <button
              class="bg-gray-600 hover:bg-gray-500 text-white font-bold px-6 py-2 rounded-lg transition-all duration-200 active:scale-95 text-xs"
              @click="gameStore.skipPack()"
            >
              SKIP
            </button>
          </div>
        </div>

        <!-- ===== WON PHASE ===== -->
        <template v-else-if="gamePhase === 'won'">
          <div class="flex-1 flex items-center justify-center">
            <div
              class="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 px-8 py-8 text-center max-w-sm w-full"
            >
              <div class="text-gold font-pixel text-lg mb-2">YOU WIN!</div>
              <div class="text-5xl mb-4">&#127942;</div>
              <div class="text-gray-400 text-sm mb-1">Final Score</div>
              <div class="text-white text-2xl font-bold mb-1">{{ roundScore.toLocaleString() }}</div>
              <div class="text-gray-500 text-sm mb-4">Ante {{ currentAnte }} — {{ blindLabel }}</div>

              <!-- Run Stats -->
              <div class="bg-white/5 border border-white/10 rounded-xl px-5 py-3 mb-6 text-sm space-y-1.5">
                <div class="flex justify-between">
                  <span class="text-gray-400">Blinds Cleared</span>
                  <span class="text-white tabular-nums">{{ runStats.blindsCleared }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Best Hand</span>
                  <span class="text-blue-300 tabular-nums"
                    >{{ runStats.bestHandName }} ({{ runStats.bestHand.toLocaleString() }})</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Total Earned</span>
                  <span class="text-gold tabular-nums">${{ runStats.totalMoneyEarned }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Jokers</span>
                  <span class="text-white">{{ jokers.length }}</span>
                </div>
              </div>
              <button
                class="bg-gold hover:bg-gold-dark text-black font-bold px-8 py-3 rounded-lg transition-colors duration-200 active:scale-95 font-pixel text-xs"
                @click="startNewRun"
              >
                NEW RUN
              </button>
            </div>
          </div>
        </template>

        <!-- ===== LOST PHASE ===== -->
        <template v-else-if="gamePhase === 'lost'">
          <div class="flex-1 flex items-center justify-center">
            <div
              class="bg-black/80 backdrop-blur-md rounded-2xl border border-white/10 px-8 py-8 text-center max-w-sm w-full"
            >
              <div class="text-red-400 font-pixel text-lg mb-2">GAME OVER</div>
              <div class="text-5xl mb-4">&#128128;</div>
              <div class="text-gray-400 text-sm mb-1">Final Score</div>
              <div class="text-white text-2xl font-bold mb-1">{{ roundScore.toLocaleString() }}</div>
              <div class="text-gray-500 text-sm mb-4">Target: {{ targetScore.toLocaleString() }}</div>

              <!-- Run Stats -->
              <div class="bg-white/5 border border-white/10 rounded-xl px-5 py-3 mb-6 text-sm space-y-1.5">
                <div class="flex justify-between">
                  <span class="text-gray-400">Reached</span>
                  <span class="text-white">Ante {{ currentAnte }} — {{ blindLabel }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Blinds Cleared</span>
                  <span class="text-white tabular-nums">{{ runStats.blindsCleared }}</span>
                </div>
                <div
                  v-if="runStats.bestHand > 0"
                  class="flex justify-between"
                >
                  <span class="text-gray-400">Best Hand</span>
                  <span class="text-blue-300 tabular-nums"
                    >{{ runStats.bestHandName }} ({{ runStats.bestHand.toLocaleString() }})</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-400">Total Earned</span>
                  <span class="text-gold tabular-nums">${{ runStats.totalMoneyEarned }}</span>
                </div>
              </div>
              <button
                class="bg-gold hover:bg-gold-dark text-black font-bold px-8 py-3 rounded-lg transition-colors duration-200 active:scale-95 font-pixel text-xs"
                @click="startNewRun"
              >
                NEW RUN
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
