import io from "socket.io-client";

enum Event {
    INITIALIZE = 'initialize',
    GAME_STATE = 'game state',
}

type NoGame = 'no game';
interface Game {}

export type GameState = NoGame | Game | null;

let gameState: GameState = null;

const socket = io();
const subscribers: Array<(gameState: GameState) => void> = [];
function notifySubscribers(): void {
    subscribers.forEach((subscriber) => {
        subscriber(gameState);
    });
}
function syncGameState(gameStateFromServer: GameState) {
    gameState = gameStateFromServer;
    notifySubscribers();
}
socket.emit(Event.INITIALIZE, syncGameState);
socket.on(Event.GAME_STATE, syncGameState);

export function getGameState(): GameState {
    return gameState;
}

export function subscribeToGameChanges(callback: (gameState: GameState) => void): void {
    subscribers.push(callback);
}