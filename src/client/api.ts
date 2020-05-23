import { ChallengeStatus, Move, PlayerName } from "./Constants";
import { socket, GameEvent } from "./subscriptions";

export function makeMove(move: Move) {
  socket.emit(GameEvent.MAKE_MOVE, move);
}

export function promptAbandon(name: PlayerName) {
  socket.emit(GameEvent.PROMPT_ABANDON, name);
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

export function resumeGameFromJSON(json: string, name: PlayerName) {
  socket.emit(GameEvent.RESUME_GAME_FROM_JSON, json, name);
}

export function startNewGame(name: PlayerName) {
  socket.emit(GameEvent.START_NEW_GAME, name);
}
