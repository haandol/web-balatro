import { evaluateHand, calculateScore, type Card } from '@/utils/poker';
import { JokerRarity, JOKER_DATABASE } from '@/utils/joker';
import { useGameStore } from '@/stores/game';

export function useBalatroGame() {
    const gameStore = useGameStore();

    // 스토어 상태 가져오기
    const {
        currentBlind,
    } = storeToRefs(gameStore);

    // 덱 초기화
    const initializeDeck = () => {
        gameStore.deck = [];
        gameStore.cardIdCounter = 0;
        const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
        // @ts-ignore ranks가 스토어 상태에 없을 수 있음 (store.ranks 사용 필요 시)
        const ranks = gameStore.ranks || ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']; // 스토어 값 또는 기본값 사용
        const newDeck: Card[] = [];
        let tempIdCounter = 0;
        for (const suit of suits) {
            for (const rank of ranks) {
                newDeck.push({ id: tempIdCounter++, suit, rank });
            }
        }
        gameStore.deck = newDeck;
        gameStore.cardIdCounter = tempIdCounter;
    };

    // 덱 셔플
    const shuffleDeck = () => {
        const array = gameStore.deck;
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    };

    // 카드 뽑기
    const drawCards = (count: number) => {
        if (gameStore.isGameOver) return;
        const cardsToDraw = Math.min(count, gameStore.deck.length, gameStore.handSize - gameStore.playerHand.length);
        if (cardsToDraw > 0) {
            const newCards = gameStore.deck.splice(0, cardsToDraw);
            gameStore.playerHand.push(...newCards);
            gameStore.cardsLeft = gameStore.deck.length;
        }
    };

    // 라운드 상태 초기화 함수 (액션 대신 직접 구현)
    const resetRoundState = () => {
        gameStore.currentRoundScore = 0;
        gameStore.handsLeft = 4; // 기본값 사용 또는 스토어 기본값 참조
        gameStore.discardsLeft = 3; // 기본값 사용
        gameStore.selectedCards = [];
        gameStore.lastPlayedHandInfo = null;
        // 이전 라운드 관련 상태 초기화
        // (previousPlayedJokers는 제거 - 필요없는 상태)
    };

     // 다음 블라인드 시작 준비
     const startNextBlind = () => {
        if (!currentBlind.value) {
            console.log("All antes cleared or error!");
            gameStore.isGameOver = true;
            return;
        }
        resetRoundState();
        // 플레이어 핸드가 비어 있으면 카드를 채움
        if (gameStore.playerHand.length === 0) {
            gameStore.playerHand = [];
        }
        // 새 라운드를 시작할 때 항상 handSize만큼 카드를 채움
        drawCards(gameStore.handSize - gameStore.playerHand.length);
        if (currentBlind.value) {
            console.log(`Starting Ante ${gameStore.currentAnteIndex + 1}, ${currentBlind.value.name}. Target: ${currentBlind.value.targetScore}`);
        }
    };

    // 다음 블라인드 또는 안테로 진행
    const advanceToNextBlind = () => {
        console.log(`${currentBlind.value?.name} Cleared!`);
        // 보상 처리 - 블라인드 격파 시 보상 지급
        if (currentBlind.value?.reward) {
            gameStore.money += currentBlind.value.reward;
            console.log(`Reward: $${currentBlind.value.reward} earned!`);
        }

        // 블라인드를 클리어했으므로 라운드 관련 상태 초기화
        resetRoundState();

        gameStore.currentBlindIndex++;
        if (gameStore.currentBlindIndex >= gameStore.antes[gameStore.currentAnteIndex].blinds.length) {
            gameStore.currentAnteIndex++;
            gameStore.currentBlindIndex = 0;
            if (gameStore.currentAnteIndex >= gameStore.antes.length) {
                console.log("Congratulations! You cleared all Antes!");
                gameStore.isGameOver = true;
                return;
            } else {
                console.log(`Advancing to Ante ${gameStore.currentAnteIndex + 1}`);
            }
        } else {
            console.log(`Advancing to next Blind in Ante ${gameStore.currentAnteIndex + 1}`);
        }

        // 모든 블라인드 변경 시 덱 초기화 및 셔플
        initializeDeck();
        shuffleDeck();
        // 새 블라인드에서는 플레이어 핸드를 비우고 다시 시작
        gameStore.playerHand = [];

        // 블라인드가 변경될 때마다 랜덤 조커 생성
        generateRandomJokers();
        // 조커 상점 표시
        gameStore.showJokerShop = true;

        startNextBlind();
    };

    // 게임 오버 처리
    const handleGameOver = () => {
        console.log("Game Over!");
        gameStore.isGameOver = true;
    };

     // 게임 초기화 함수
    const initializeGame = () => {
        gameStore.isGameOver = false;
        gameStore.currentAnteIndex = 0;
        gameStore.currentBlindIndex = 0;
        gameStore.money = 4; // 초기 자금 설정
        gameStore.activeJokers = []; // 조커 초기화
        gameStore.playerHand = []; // 플레이어 핸드 초기화
        resetRoundState(); // 라운드 상태 초기화 포함

        // 디버깅: 조커 상태 확인
        console.log('Game initialized. Active jokers:', gameStore.activeJokers.length);
    };

    // 테스트용 조커 초기화 함수
    const initTestJokers = () => {
        const store = useGameStore();

        // 테스트용 조커 3개 추가
        store.activeJokers = [
            {
                id: 'j_plus_4_mult',
                name: '승수 조커',
                description: '+4 Mult',
                rarity: JokerRarity.COMMON,
                calculateAddedMultiplier: () => 4
            },
            {
                id: 'j_chips',
                name: '칩 조커',
                description: '+50 Chips',
                rarity: JokerRarity.COMMON,
                calculateChips: () => 50
            },
            {
                id: 'j_multiplier',
                name: '곱셈 조커',
                description: 'x1.5 Mult',
                rarity: JokerRarity.RARE,
                calculateMultipliedMultiplier: () => 1.5
            }
        ];
    };

    // 게임 시작 또는 재시작
    const startGame = () => {
        // gameStore.initializeGame(); // 액션 호출 대신 직접 함수 호출
        initializeGame();

        initializeDeck();
        shuffleDeck();

        // 첫 블라인드에서도 조커 상점 표시를 위한 랜덤 조커 생성
        generateRandomJokers();
        gameStore.showJokerShop = true;

        startNextBlind();

        // 테스트용 조커 추가
        // initTestJokers(); // 조커 상점을 통해 구매하도록 제거하거나 주석 처리
    };

    // 게임 재시작
    const restartGame = () => {
        startGame();
    };

    // 카드 선택 토글
    const toggleCardSelection = (card: Card) => {
        if (gameStore.isGameOver) return;
        const index = gameStore.selectedCards.findIndex(selected => selected.id === card.id);
        if (index > -1) {
            gameStore.selectedCards.splice(index, 1);
        } else {
            if (gameStore.selectedCards.length < 5) {
                gameStore.selectedCards.push(card);
            } else {
                alert("You can select a maximum of 5 cards.");
            }
        }
    };

    // 핸드 플레이
    const playHand = () => {
        if (!gameStore.canPlay || !currentBlind.value) return;

        console.log("Attempting to play hand...");
        gameStore.lastPlayedHandInfo = null;

        const evaluation = evaluateHand(gameStore.selectedCards);
        if (!evaluation) {
            console.error("Could not evaluate hand.");
            return;
        }

        // 활성화된 조커가 있는지 확인하고 로그 출력
        const jokersToApply = gameStore.activeJokers && gameStore.activeJokers.length > 0 ? gameStore.activeJokers : [];
        console.log(`Using ${jokersToApply.length} active jokers for score calculation`);
        // 디버깅을 위해 조커 목록 출력
        if (jokersToApply.length > 0) {
            console.log('Active jokers:', jokersToApply.map(joker => joker.name).join(', '));
        }

        const scoreResult = calculateScore(evaluation, gameStore.selectedCards, jokersToApply);

        // 상태 업데이트: 직접 스토어에 값을 할당하여 반응성 보장
        gameStore.currentRoundScore += scoreResult.totalScore;
        gameStore.handsLeft -= 1; // handsLeft 감소
        gameStore.lastPlayedHandInfo = { handRank: scoreResult.handRank, score: scoreResult.totalScore };

        const playedCardIds = new Set(gameStore.selectedCards.map(c => c.id));
        // 플레이어 핸드 업데이트: 새 배열 할당으로 반응성 보장
        gameStore.playerHand = gameStore.playerHand.filter(card => !playedCardIds.has(card.id));
        gameStore.selectedCards = []; // 선택된 카드 초기화
        drawCards(playedCardIds.size);

        if (currentBlind.value && gameStore.currentRoundScore >= currentBlind.value.targetScore) { // currentBlind null 체크 추가
            advanceToNextBlind();
        } else if (gameStore.handsLeft === 0) {
            if(gameStore.discardsLeft === 0) {
                handleGameOver();
            } else {
                console.log("Hands depleted, but discards remain.");
                 // 손이 0이 되고 점수가 목표에 도달하지 못했는지 확인
                if (currentBlind.value && gameStore.currentRoundScore < currentBlind.value.targetScore) {
                    console.log(`Failed to reach target score. Current: ${gameStore.currentRoundScore}, Target: ${currentBlind.value.targetScore}`);
                    handleGameOver();
                }
            }
        }
    };

    // 카드 버리기
    const discardCards = () => {
        if (!gameStore.canDiscard || !currentBlind.value) return;

        console.log("Attempting to discard cards...");
        gameStore.lastPlayedHandInfo = null;

        gameStore.discardsLeft -= 1;

        const discardedCardIds = new Set(gameStore.selectedCards.map(c => c.id));
        gameStore.playerHand = gameStore.playerHand.filter(card => !discardedCardIds.has(card.id));
        const numberOfDiscards = gameStore.selectedCards.length;
        gameStore.selectedCards = [];
        drawCards(numberOfDiscards);

        if (currentBlind.value && gameStore.handsLeft === 0 && gameStore.discardsLeft === 0 && gameStore.currentRoundScore < currentBlind.value.targetScore) {
            handleGameOver();
        }
    };

    // 랜덤 조커 생성 함수
    const generateRandomJokers = () => {
        // JOKER_DATABASE에서 사용 가능한 모든 조커 ID 가져오기
        const allJokerIds = Object.keys(JOKER_DATABASE);
        const currentJokerIds = new Set(gameStore.activeJokers.map(joker => joker.id));

        // 이미 활성화된 조커 제외
        const availableJokerIds = allJokerIds.filter(id => !currentJokerIds.has(id));

        if (availableJokerIds.length === 0) {
            console.log("No more jokers available!");
            gameStore.availableJokers = [];
            return;
        }

        // 블라인드 단계에 따라 조커 수 결정 (최소 2개, 최대 4개)
        const numberOfJokers = Math.min(Math.max(2, 1 + Math.floor(gameStore.currentAnteIndex / 2)), 4);

        // 랜덤으로 조커 선택
        const selectedJokers = [];
        for (let i = 0; i < numberOfJokers && i < availableJokerIds.length; i++) {
            // 랜덤 인덱스 생성
            const randomIndex = Math.floor(Math.random() * availableJokerIds.length);
            const jokerId = availableJokerIds[randomIndex];

            // 선택된 조커 추가하고 목록에서 제거
            selectedJokers.push(JOKER_DATABASE[jokerId]);
            availableJokerIds.splice(randomIndex, 1);
        }

        // 선택된 조커를 사용 가능한 조커로 설정
        gameStore.availableJokers = selectedJokers;
    };

    // 조커 구매 함수
    const buyJoker = (joker: Joker) => {
        const jokerPrice = gameStore.getJokerPrice(joker);

        // 플레이어가 충분한 돈을 가지고 있는지 확인
        if (gameStore.money < jokerPrice) {
            console.log(`Not enough money to buy ${joker.name}. Need ${jokerPrice} coins.`);
            return false;
        }

        // 조커 슬롯이 가득 찼는지 확인
        if (gameStore.activeJokers.length >= gameStore.maxJokerSlots) {
            console.log(`Cannot buy ${joker.name}. Joker slots are full.`);
            return false;
        }

        // 돈 지불하고 조커 추가
        gameStore.money -= jokerPrice;
        gameStore.activeJokers.push(joker);

        // 구매한 조커를 사용 가능한 조커 목록에서 제거
        gameStore.availableJokers = gameStore.availableJokers.filter(j => j.id !== joker.id);

        console.log(`Purchased ${joker.name} for ${jokerPrice} coins!`);
        return true;
    };

    // 조커 상점 닫기
    const closeJokerShop = () => {
        gameStore.showJokerShop = false;
        gameStore.availableJokers = [];
    };

    // 반환할 함수들
    return {
        startGame,
        restartGame,
        toggleCardSelection,
        playHand,
        discardCards,
        buyJoker,
        closeJokerShop,
    };
}