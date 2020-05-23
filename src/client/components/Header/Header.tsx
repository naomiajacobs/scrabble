import React from "react";

import {
  ActionState,
  FinishedGameState,
  GameState,
  PlayerName,
} from "../../Constants";
import GameSummary from "../GameSummary/GameSummary";
import { getActionState, getOtherPlayer } from "../../util";

import "./Header.css";
import { promptAbandon, resumeGameFromJSON } from "../../api";

function TitleCenter({
  actionState,
  opponentName,
}: {
  actionState: ActionState;
  opponentName: PlayerName;
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
  return <div className="header-item action-info">{text}</div>;
}

export default function Header({
  gameOver,
  gameState,
}: {
  gameOver: boolean;
  gameState: GameState;
}): JSX.Element {
  const actionState = getActionState(gameState);
  const name = gameState.player.name;

  const resumeGame = () => {
    const json = prompt("Paste in game JSON");
    if (!json) {
      alert("Did not give JSON");
    } else {
      resumeGameFromJSON(json, name);
    }
  };

  return (
    <div className="header">
      <div className="header-item greeting">Hi, {name}!</div>
      {gameOver ? (
        <GameSummary gameState={gameState as FinishedGameState} />
      ) : (
        <TitleCenter
          actionState={actionState}
          opponentName={getOtherPlayer(name)}
        />
      )}
      <div className="right-buttons">
        <button className="header-item small" onClick={resumeGame}>
          Resume Game
        </button>
        {gameOver ? (
          <button className="header-item small">Start New Game</button>
        ) : (
          <button
            className="header-item abandon danger small"
            onClick={() => promptAbandon(name)}
          >
            Abandon Game
          </button>
        )}
      </div>
    </div>
  );
}
