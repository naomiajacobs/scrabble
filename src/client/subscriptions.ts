import { v4 as uuid } from "uuid";
import { defaultServerStatus, ServerStatus } from "./Constants";
import io from "socket.io-client";

export enum GameEvent {
  INITIALIZE = "initialize",
  GAME_STATE = "server status",
  MAKE_MOVE = "make move",
  ERROR = "error",
}

// initialize socket connection
const name = prompt("What's your name?", "Mert");
export const socket = io();
socket.emit(GameEvent.INITIALIZE, name, syncServerStatus);
socket.on(GameEvent.GAME_STATE, syncServerStatus);
socket.on(GameEvent.ERROR, (messages: Array<string>) => {
  alert(messages.join("\n"));
});

const subscribers: {
  [subscriptionId: string]: (gameState: ServerStatus) => void;
} = {};

function notifySubscribers(): void {
  for (const subscriberId of Object.keys(subscribers)) {
    subscribers[subscriberId](serverStatus);
  }
}

let serverStatus: ServerStatus = defaultServerStatus;

export function syncServerStatus(status: ServerStatus) {
  serverStatus = status;
  notifySubscribers();
}

export function subscribeToServer(
  callback: (newStatus: ServerStatus) => void
): string {
  const id = uuid();
  subscribers[id] = callback;
  callback(serverStatus);
  return id;
}

export function unsubscribeFromServer(id: string) {
  delete subscribers[id];
}
