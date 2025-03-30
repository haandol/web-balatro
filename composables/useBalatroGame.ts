// composables/useBalatroGame.ts
import { storeToRefs } from 'pinia';
import { useGameStore } from '@/stores/game';
import { evaluateHand, calculateScore, type Card } from '@/utils/poker';

export function useBalatroGame() {
  const gameStore = useGameStore();
  const {
    // State (writable refs needed for direct manipulation in composable)
    deck,
    playerHand,
    selectedCards,
    cardIdCounter,
    currentAnteIndex,
    currentBlindIndex,
    currentRoundScore,
    handsLeft,
    discardsLeft,
    lastPlayedHandInfo,
    isGameOver,
    // Config (read-only refs are fine)
    handSize,
    antes,
    suits,
    ranks,
    // Getters
    currentBlind,
    canPlay,
    canDiscard,
  } = storeToRefs(gameStore);

  // --- Private Helper Functions (moved from store actions) ---
  const initializeDeck = () => {
    deck.value = []; // Direct state manipulation (consider if actions are preferred)
    cardIdCounter.value = 0;
    for (const suit of suits.value) {
      for (const rank of ranks.value) {
        deck.value.push({ id: cardIdCounter.value++, suit, rank });
      }
    }
  };

  const shuffleDeck = () => {
    for (let i = deck.value.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck.value[i], deck.value[j]] = [deck.value[j], deck.value[i]];
    }
  };

  const drawCards = (count: number) => {
    if (isGameOver.value) return;

    const cardsToDraw = Math.min(count, deck.value.length, handSize.value - playerHand.value.length);
    if (cardsToDraw > 0) {
      const newCards = deck.value.splice(0, cardsToDraw);
      playerHand.value.push(...newCards);
      console.log(`Drew ${cardsToDraw} cards.`);
    } else if (deck.value.length === 0) {
      console.log("Deck is empty!");
      // TODO: Handle empty deck scenario
    } else {
      console.log("Hand is full.");
    }
  };

  const startNextBlind = () => {
    const blind = currentBlind.value; // Use getter ref
    if (!blind) {
        console.log("All antes cleared or error!");
        isGameOver.value = true; // Directly modify state
        return;
    }
    // Reset round state
    currentRoundScore.value = 0;
    handsLeft.value = 4; // TODO: Make configurable
    discardsLeft.value = 3; // TODO: Make configurable
    selectedCards.value = [];
    lastPlayedHandInfo.value = null;

    // Fill hand
    drawCards(handSize.value - playerHand.value.length);

    console.log(`Starting Ante ${currentAnteIndex.value + 1}, ${blind.name}. Target: ${blind.targetScore}`);
  };

    const advanceToNextBlind = () => {
        const blind = currentBlind.value;
        if (!blind) return;

        console.log(`${blind.name} Cleared!`);
        // TODO: Reward logic (e.g., enter shop)

        currentBlindIndex.value++;

        if (currentBlindIndex.value >= antes.value[currentAnteIndex.value].blinds.length) {
            currentAnteIndex.value++;
            currentBlindIndex.value = 0;

            if (currentAnteIndex.value >= antes.value.length) {
                console.log("Congratulations! You cleared all Antes!");
                isGameOver.value = true;
                return;
            } else {
                console.log(`Advancing to Ante ${currentAnteIndex.value + 1}`);
                // Reset deck/hand for next ante (confirm rules)
                initializeDeck();
                shuffleDeck();
                playerHand.value = []; // Empty hand
            }
        }
        // Prepare for the next blind (includes drawing cards after deck reset)
        startNextBlind();
    };

    const handleGameOver = () => {
        console.log("Game Over! Target score not met.");
        isGameOver.value = true;
        // Additional game over logic (e.g., show scoreboard)
    };

  // --- Exposed Functions (Public API of the composable) ---
  const startGame = () => {
    // Reset core game state
    isGameOver.value = false;
    currentAnteIndex.value = 0;
    currentBlindIndex.value = 0;
    currentRoundScore.value = 0;
    handsLeft.value = 4;
    discardsLeft.value = 3;
    lastPlayedHandInfo.value = null;
    deck.value = [];
    playerHand.value = [];
    selectedCards.value = [];
    cardIdCounter.value = 0;

    initializeDeck();
    shuffleDeck();
    startNextBlind(); // Start the first blind
  };

    const toggleCardSelection = (card: Card) => {
        if (isGameOver.value) return;

        const index = selectedCards.value.findIndex(selected => selected.id === card.id);
        if (index > -1) {
            selectedCards.value.splice(index, 1);
        } else {
            if (selectedCards.value.length < 5) {
                selectedCards.value.push(card);
            } else {
                // TODO: Provide user feedback (e.g., use Nuxt UI Toast)
                console.warn("You can select a maximum of 5 cards.");
            }
        }
    };

    const playHand = () => {
        const blind = currentBlind.value; // Get current blind from ref
        if (!canPlay.value || !blind) return; // Use getter ref

        console.log("Playing hand:", selectedCards.value.map(c => `${c.rank}${c.suit}`));

        const evaluation = evaluateHand(selectedCards.value);
        if (!evaluation) {
            console.error("Could not evaluate hand.");
            return;
        }

        // TODO: Incorporate Jokers, modifiers, etc., into score calculation
        const scoreResult = calculateScore(evaluation, selectedCards.value);

        // Update state directly
        currentRoundScore.value += scoreResult.totalScore;
        handsLeft.value--;
        lastPlayedHandInfo.value = { handRank: scoreResult.handRank, totalScore: scoreResult.totalScore };

        const playedCardIds = new Set(selectedCards.value.map(c => c.id));
        playerHand.value = playerHand.value.filter(card => !playedCardIds.has(card.id));
        const cardsToDrawCount = selectedCards.value.length;
        selectedCards.value = []; // Deselect cards
        drawCards(cardsToDrawCount);

        console.log(`Hand played. Round Score: ${currentRoundScore.value} / ${blind.targetScore}. Hands left: ${handsLeft.value}`);

        // Check for blind clear or game over condition
        if (currentRoundScore.value >= blind.targetScore) {
            advanceToNextBlind();
        } else if (handsLeft.value === 0) { // Check only handsLeft
            // Check if score is insufficient when hands are depleted
            if (currentRoundScore.value < blind.targetScore) {
                handleGameOver();
            }
            // If score is met, advanceToNextBlind already handled it.
        }
    };

    const discardCards = () => {
        if (!canDiscard.value) return; // Use getter ref

        console.log("Discarding cards:", selectedCards.value.map(c => `${c.rank}${c.suit}`));

        // Update state directly
        discardsLeft.value--;
        lastPlayedHandInfo.value = null; // Clear last played hand info

        const discardedCardIds = new Set(selectedCards.value.map(c => c.id));
        playerHand.value = playerHand.value.filter(card => !discardedCardIds.has(card.id));
        const cardsToDrawCount = selectedCards.value.length;
        selectedCards.value = []; // Deselect cards
        drawCards(cardsToDrawCount);

        console.log("Cards discarded. Discards left:", discardsLeft.value);

        // Check for game over condition after discarding
        const blind = currentBlind.value;
        // Check if hands are left AND score is insufficient
        if (handsLeft.value === 0 && blind && currentRoundScore.value < blind.targetScore) {
             // Check only handsLeft and score
            handleGameOver();
        }
    };

    const restartGame = () => {
        startGame(); // Simply call the startGame logic
    };


  // Return the functions that the component will use
  return {
    // Game flow functions
    startGame,
    restartGame,
    // Player actions
    toggleCardSelection,
    playHand,
    discardCards,
    // Read-only state/getters (optional, component can get from store directly)
    // playerHand, selectedCards, currentAnteIndex, currentRoundScore, handsLeft, discardsLeft, lastPlayedHandInfo, isGameOver, currentBlind, isSelected, canPlay, canDiscard
  };
}