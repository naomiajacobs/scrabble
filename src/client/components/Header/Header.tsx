import React from "react";

import {
  ActionState,
  FinishedGameState,
  GameState,
  PlayerName,
} from "../../Constants";
import GameSummary from "../GameSummary/GameSummary";
import { getActionState, getOtherPlayer } from "../../util";

import './Header.css';
import {promptAbandon} from "../../api";

function Title({
  actionState,
  yourName,
  opponentName,
  abandonGame
}: {
  actionState: ActionState;
  yourName: PlayerName;
  opponentName: PlayerName;
  abandonGame: () => void;
}): JSX.Element {
  let text;
  switch (actionState) {
    case ActionState.GO:
      text = "It's your turn";
      break;
    case ActionState.WAITING_FOR_OPPONENT_MOVE:
      text = `It's ${opponentName}'s turn`;
      break;
    case ActionState.WAITING_FOR_CHALLENGE_OR_DRAW:
      text = `Waiting for ${opponentName} to challenge or accept move`;
      break;
    case ActionState.CHALLENGE_OR_DRAW:
      text = `${opponentName} just went - accept or challenge the move`;
      break;
  }
  return (
    <>
      <div className="header-item greeting">Hi, {yourName}!</div>
      <div className="header-item action-info">{text}</div>
      <button className="header-item abandon danger medium"onClick={abandonGame}>Abandon Game</button>
    </>
  );
}

export default function Header({
  gameOver,
  gameState,
}: {
  gameOver: boolean;
  gameState: GameState;
}): JSX.Element {
  const actionState = getActionState(gameState);

  return (
    <div className="header">
      {gameOver ? (
        <GameSummary gameState={gameState as FinishedGameState} />
      ) : (
        <Title
          actionState={actionState}
          yourName={gameState.player.name}
          opponentName={getOtherPlayer(gameState.player.name)}
          abandonGame={promptAbandon}
        />
      )}
    </div>
  );
}
