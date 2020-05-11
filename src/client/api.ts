import { ChallengeStatus, Move, PlayerName } from "./Constants";
import { socket, GameEvent } from "./subscriptions";

export function makeMove(move: Move) {
  socket.emit(GameEvent.MAKE_MOVE, move);
}

export function promptAbandon() {
  socket.emit(GameEvent.PROMPT_ABANDON);
}

export function acceptMove(name: PlayerName) {
  socket.emit(GameEvent.ACCEPT_MOVE, name);
}

export function challengeMove(name: PlayerName) {
  socket.emit(GameEvent.CHALLENGE_MOVE, name);
}

export function resolveChallenge(
  challengeStatus:
    | ChallengeStatus.RESOLVED_INVALID
    | ChallengeStatus.RESOLVED_VALID
) {
  socket.emit(GameEvent.CHALLENGE_RESOLVED, challengeStatus);
}
