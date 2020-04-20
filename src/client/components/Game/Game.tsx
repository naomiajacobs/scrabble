import React from "react";

import { GameState } from "../../Constants";
import { getDeriveBoard } from "../../util";
import Rack from "../Rack/Rack";
import ScrabbleBoard from "../ScrabbleBoard/ScrabbleBoard";
import ControlButtons from "../ControlButtons/ControlButtons";
import useGameLetters from "../../state/useGameLetters";

export default function Game({
  gameState,
}: {
  gameState: GameState;
}): JSX.Element {
  const active = gameState.player.name === gameState.activePlayer;

  const {
    placedLetters,
    clearLetters,
    reRackLetter,
    selectedLetterIndex,
    setSelectedLetterIndex,
    placeSelectedLetter,
  } = useGameLetters();

  return (
    <div className="game">
      <h2>
        Hi, {gameState.player.name}! It's{" "}
        {active ? "your" : `${gameState.activePlayer}'s`} turn
      </h2>
      <ControlButtons
        active={active}
        placedLetters={placedLetters}
        clearLetters={clearLetters}
        reRackLetter={reRackLetter}
      />
      <Rack
        tiles={gameState.player.rack}
        selectedLetterIndex={selectedLetterIndex}
        setSelectedLetterIndex={active ? setSelectedLetterIndex : () => {}}
        placedLetters={placedLetters}
      />
      <ScrabbleBoard
        board={getDeriveBoard(
          gameState.moves,
          placedLetters,
          gameState.player.rack
        )}
        placeLetter={active ? placeSelectedLetter : () => {}}
        setSelectedLetter={active ? setSelectedLetterIndex : () => {}}
        selectedLetter={selectedLetterIndex}
      />
    </div>
  );
}
