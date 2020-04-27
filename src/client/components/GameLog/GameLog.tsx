import React from "react";

import { GameState, PlayerName } from "../../Constants";

import "./GameLog.css";
import { GameScore } from "../../util";

export default function GameLog({
  gameState,
}: {
  gameState: GameState;
}): JSX.Element {
  const gameScore = new GameScore(gameState);
  const naomiScore = gameScore.scoreForPlayer(PlayerName.NAOMI);
  const mertScore = gameScore.scoreForPlayer(PlayerName.MERT);
  const numRounds = Math.ceil(gameState.moves.length / 2);
  const naomiMoves = gameState.moves
    .map((move, i) => ({move, gameIndex: i}))
    .filter((moveInfo) => moveInfo.move.playerName === PlayerName.NAOMI);
  const mertMoves = gameState.moves
    .map((move, i) => ({move, gameIndex: i}))
    .filter((moveAndIndex) => moveAndIndex.move.playerName === PlayerName.MERT);
  return (
    <div className="game-log">
      <table>
        <thead>
          <tr>
            <td>{PlayerName.NAOMI}</td>
            <td>{PlayerName.MERT}</td>
          </tr>
        </thead>
        <tbody>
          <tr className="scores">
            <td className="score">Score: {naomiScore}</td>
            <td className="score">Score: {mertScore}</td>
          </tr>
          {Array(numRounds)
            .fill(null)
            .map((foo, i) => (
              <tr className="move-row" key={i}>
                <td className="move">
                  {naomiMoves[i] && `${i + 1}: ${gameScore.scoreForMove(naomiMoves[i].gameIndex)}`}
                </td>
                <td className="move">
                  {mertMoves[i] && `${i + 1}: ${gameScore.scoreForMove(mertMoves[i].gameIndex)}`}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
