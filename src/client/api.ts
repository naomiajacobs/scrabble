import {Move} from "./Constants";
import {socket, GameEvent} from "./subscriptions";

export function makeMove(move: Move) {
  socket.emit(GameEvent.MAKE_MOVE, move);
}

export function promptAbandon() {
  socket.emit(GameEvent.PROMPT_ABANDON);
}