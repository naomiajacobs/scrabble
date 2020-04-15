import io from "socket.io-client";
import {v4 as uuid} from 'uuid';
import {Letter} from "./Constants";

enum Event {
  INITIALIZE = 'initialize',
  GAME_STATE = 'game state',
}

type NoGame = 'no game';
type GameFull = 'too late';
interface Player {
  rack: Array<Letter>;
}
export interface GameState {
  players: [Player, Player];
  letterBag: Array<Letter>;
}
export type IndeterminateGameState = NoGame | GameState | GameFull | null;

let indeterminateGameState: IndeterminateGameState = null;

const subscribers: {[subscriptionId: string]: (gameState: IndeterminateGameState) => void} = {};

function notifySubscribers(): void {
  for (const subscriberId of Object.keys(subscribers)) {
    subscribers[subscriberId](indeterminateGameState);
  }
}

function syncGameState(gameStateFromServer: GameState) {
  indeterminateGameState = gameStateFromServer;
  notifySubscribers();
}

export function subscribeToGameChanges(callback: (gameState: IndeterminateGameState) => void): string {
  const id = uuid();
  subscribers[id] = callback;
  callback(indeterminateGameState);
  return id;
}

export function unsubscribeFromGameChanges(id: string) {
  delete subscribers[id];
}

const socket = io();
socket.emit(Event.INITIALIZE, syncGameState);
socket.on(Event.GAME_STATE, syncGameState);