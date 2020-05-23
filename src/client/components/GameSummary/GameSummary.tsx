import React from "react";

import { FinishedGameState } from "../../Constants";
import { FinalGameScore, getOtherPlayer } from "../../util";

export default function GameSummary({
  gameState,
}: {
  gameState: FinishedGameState;
}): JSX.Element {
  const gameScore = new FinalGameScore(gameState);
  const opponent = getOtherPlayer(gameState.player.name);
  const finalScores = gameScore.finalScores();
  const selfFinalScore = finalScores[gameState.player.name];
  const opponentFinalScore = finalScores[opponent];

  const youWon = selfFinalScore > opponentFinalScore;

  if (youWon) {
    return <h2>YOU WON, CONGRATS!!!</h2>;
  } else {
    return <h2>{`HAHA, ${opponent} WON - YOU LOSE 😛`}</h2>;
  }
}
