import { v4 as uuid } from "uuid";
import { defaultServerStatus, PlayerName, ServerStatus } from "./Constants";
import io from "socket.io-client";
import { getOtherPlayer } from "./util";

export enum GameEvent {
  INITIALIZE = "INITIALIZE",
  SERVER_STATUS = "SERVER_STATUS",
  MAKE_MOVE = "MAKE_MOVE",
  GAME_ERROR = "GAME_ERROR",
  PROMPT_ABANDON = "PROMPT_ABANDON",
  GET_ABANDON_CONFIRMATION = "GET_ABANDON_CONFIRMATION",
  CONFIRM_ABANDON = "CONFIRM_ABANDON",
  REJECT_ABANDON = "REJECT_ABANDON",
  ABANDON_NOTIFICATION = "ABANDON_NOTIFICATION",
  ACCEPT_MOVE = "ACCEPT_MOVE",
  CHALLENGE_MOVE = "CHALLENGE_MOVE",
  CHALLENGE_RESOLVED = "CHALLENGE_RESOLVED",
  RESUME_GAME_FROM_JSON = "RESUME_GAME_FROM_JSON",
  START_NEW_GAME = "START_NEW_GAME",
}

// initialize socket connection
let name = prompt("What's your name?", "Mert");
while (!name) {
  name = prompt("No really, who are you? You should be Mert or Naomi");
}
export const socket = io();
socket.emit(GameEvent.INITIALIZE, name, syncServerStatus);
socket.on(GameEvent.SERVER_STATUS, syncServerStatus);
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
  console.log('Got new status from server: ', status);
  serverStatus = status;
  notifySubscribers();
}

export function subscribeToServer(
  callback: (newStatus: ServerStatus) => void
): string {
  console.log('Subscribing to server');
  const id = uuid();
  subscribers[id] = callback;
  callback(serverStatus);
  return id;
}

export function unsubscribeFromServer(id: string) {
  console.log('Unsubscribing to server');
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
