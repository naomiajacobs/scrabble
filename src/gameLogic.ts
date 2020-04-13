import io from "socket.io-client";
import {v4 as uuid} from 'uuid';

enum Event {
    INITIALIZE = 'initialize',
    GAME_STATE = 'game state',
}

type NoGame = 'no game';
interface Game {}
export type GameState = NoGame | Game | null;

let gameState: GameState = null;

const subscribers: {[subscriptionId: string]: (gameState: GameState) => void} = {};

function notifySubscribers(): void {
    for (const subscriberId of Object.keys(subscribers)) {
        subscribers[subscriberId](gameState);
    }
}

function syncGameState(gameStateFromServer: GameState) {
    gameState = gameStateFromServer;
    notifySubscribers();
}

export function subscribeToGameChanges(callback: (gameState: GameState) => void): string {
    const id = uuid();
    subscribers[id] = callback;
    callback(gameState);
    return id;
}

export function unsubscribeFromGameChanges(id: string) {
    delete subscribers[id];
}

const socket = io();
socket.emit(Event.INITIALIZE, syncGameState);
socket.on(Event.GAME_STATE, syncGameState);