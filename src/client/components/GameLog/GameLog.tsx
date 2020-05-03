import React from "react";

import {
  FinishedGameState,
  GameState,
  Move,
  MoveType,
  PlayerName,
  PlayMove,
} from "../../Constants";

import "./GameLog.css";
import { FinalGameScore, GameScore } from "../../util";

const dumpEmoji = "🔄";
const challengeEmoji = "👊";
const bingoEmoji = "🎉";

function EndGameAdjustments({
  gameState,
}: {
  gameState: FinishedGameState;
}): JSX.Element {
  const score = new FinalGameScore(gameState);
  const scores = score.endGameScoreAdjustments();

  return (
    <tr>
      <td>End adjustment: {scores[PlayerName.NAOMI]}</td>
      <td>End adjustment: {scores[PlayerName.MERT]}</td>
    </tr>
  );
}

function MoveInfo({
  gameScore,
  moveInfo,
}: {
  gameScore: GameScore;
  moveInfo?: { move: Move; gameIndex: number };
}): JSX.Element {
  if (!moveInfo) {
    return <td className="move" />;
  }
  const { move, gameIndex } = moveInfo;

  return (
    <td className="move">
      <span>{gameScore.scoreForMove(gameIndex)}</span>
      {move.type === MoveType.DUMP && <span className="emoji">{dumpEmoji}</span>}
      {move.type === MoveType.PLAY &&
        (move as PlayMove).lettersPlaced.length === 7 &&
        <span className="emoji">{bingoEmoji}</span>}
    </td>
  );
}

export default function GameLog({
  gameState,
  gameOver,
}: {
  gameState: GameState;
  gameOver: boolean;
}): JSX.Element {
  const gameScore = new GameScore(gameState);
  const naomiScore = gameScore.scoreForPlayer(PlayerName.NAOMI);
  const mertScore = gameScore.scoreForPlayer(PlayerName.MERT);
  const numRounds = Math.ceil(gameState.moves.length / 2);
  const naomiMoves = gameState.moves
    .map((move, i) => ({ move, gameIndex: i }))
    .filter((moveInfo) => moveInfo.move.playerName === PlayerName.NAOMI);
  const mertMoves = gameState.moves
    .map((move, i) => ({ move, gameIndex: i }))
    .filter((moveAndIndex) => moveAndIndex.move.playerName === PlayerName.MERT);

  return (
    <div className="game-log">
      <table>
        <thead>
          <tr className="names">
            <td />
            <td>{PlayerName.NAOMI}</td>
            <td>{PlayerName.MERT}</td>
          </tr>
          <tr className="score-header">
            <td>Move</td>
            <td className="score">Total: {naomiScore}</td>
            <td className="score">Total: {mertScore}</td>
          </tr>
        </thead>
        <tbody className="scores">
          {Array(numRounds)
            .fill(null)
            .map((foo, i) => (
              <tr className="move-row" key={i}>
                <td>{i + 1}</td>
                <td className="move">
                  <MoveInfo gameScore={gameScore} moveInfo={naomiMoves[i]} />
                </td>
                <td className="move">
                  <MoveInfo gameScore={gameScore} moveInfo={mertMoves[i]} />
                </td>
              </tr>
            ))}
          {gameOver && (
            <EndGameAdjustments gameState={gameState as FinishedGameState} />
          )}
        </tbody>
      </table>
    </div>
  );
}
