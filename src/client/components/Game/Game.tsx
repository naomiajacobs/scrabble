import React  from "react";

import {
  GameState,
} from "../../Constants";
import { getDeriveBoardFromMoves } from "../../util";
import Rack from "../Rack/Rack";
import ScrabbleBoard from "../ScrabbleBoard/ScrabbleBoard";

export default function Game({
  gameState,
}: {
  gameState: GameState;
}): JSX.Element {
  return (
    <div className="game">
      <h3>Hi, {gameState.player.name}</h3>
      <h4>
        It's{" "}
        {gameState.player.name === gameState.activePlayer
          ? "your"
          : `${gameState.activePlayer}'s`}{" "}
        turn
      </h4>
      <Rack tiles={gameState.player.rack} />
      <ScrabbleBoard board={getDeriveBoardFromMoves(gameState.moves)} />
    </div>
  );
}
