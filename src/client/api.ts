import {Move} from "./Constants";
import {socket, GameEvent} from "./subscriptions";

export function makeMove(move: Move) {
  socket.emit(GameEvent.MAKE_MOVE, move);
}