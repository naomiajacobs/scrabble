import { v4 as uuid } from "uuid";
import { defaultServerStatus, PlayerName, ServerStatus } from "./Constants";
import io from "socket.io-client";
import { getOtherPlayer } from "./util";

export enum GameEvent {
  INITIALIZE = "initialize",
  GAME_STATE = "server status",
  MAKE_MOVE = "make move",
  GAME_ERROR = "game error",
  PROMPT_ABANDON = "prompt abandon",
  GET_ABANDON_CONFIRMATION = "get abandon confirmation",
  CONFIRM_ABANDON = "confirm abandon",
  REJECT_ABANDON = "reject abandon",
  ABANDON_NOTIFICATION = "abandon notification",
}

// initialize socket connection
let name = prompt("What's your name?", "Mert");
while (!name) {
  name = prompt("No really, who are you? You should be Mert or Naomi");
}
export const socket = io();
socket.emit(GameEvent.INITIALIZE, name, syncServerStatus);
socket.on(GameEvent.GAME_STATE, syncServerStatus);
socket.on(GameEvent.GAME_ERROR, (messages: Array<string>) => {
  alert(messages.join("\n"));
});
socket.on(GameEvent.GET_ABANDON_CONFIRMATION, confirmAbandon);
socket.on(GameEvent.ABANDON_NOTIFICATION, notifyAbandon);

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

function confirmAbandon(selfPrompted: boolean) {
  const message = selfPrompted
    ? "Do you really want to abandon this game?"
    : `${getOtherPlayer(
        name as PlayerName
      )} wants to abandon the game. Do you agree?`;
  const confirmed = window.confirm(message);
  if (confirmed) {
    socket.emit(GameEvent.CONFIRM_ABANDON, name);
  } else {
    socket.emit(GameEvent.REJECT_ABANDON, name);
  }
}

function notifyAbandon() {
  alert("Previous game was abandoned, starting new game now.");
}
