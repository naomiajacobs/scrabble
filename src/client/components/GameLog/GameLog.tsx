import React from "react";

import { GameState, Move, PlayerName } from "../../Constants";

import "./GameLog.css";

function calculateScoreForMove(gameState: GameState, move: Move): number {
  return 10;
}

function calculateScore(gameState: GameState, player: PlayerName): number {
  return 100;
}

export default function GameLog({
  gameState,
}: {
  gameState: GameState;
}): JSX.Element {
  const naomiScore = calculateScore(gameState, PlayerName.NAOMI);
  const mertScore = calculateScore(gameState, PlayerName.MERT);
  const naomiMoves = gameState.moves.filter(
    (m) => m.playerName === PlayerName.NAOMI
  );
  const mertMoves = gameState.moves.filter(
    (m) => m.playerName === PlayerName.MERT
  );
  const longestMoves = Math.max(naomiMoves.length, mertMoves.length);
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
          {Array(longestMoves)
            .fill(null)
            .map((foo, i) => (
              <tr className="move-row">
                <td className="move">
                  {naomiMoves[i] &&
                    `${i + 1}: ${calculateScoreForMove(
                      gameState,
                      naomiMoves[i]
                    )}`}
                </td>
                <td className="move">
                  {mertMoves[i] &&
                    `${i + 1}: ${calculateScoreForMove(
                      gameState,
                      mertMoves[i]
                    )}`}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
