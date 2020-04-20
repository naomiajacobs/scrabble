import React, { useState } from "react";

import { GameState, Location, RackIndex } from "../../Constants";
import { getDeriveBoard } from "../../util";
import Rack from "../Rack/Rack";
import ScrabbleBoard from "../ScrabbleBoard/ScrabbleBoard";
import usePlacedLetters from "../../state/usePlacedLetters";
import ControlButtons from "../ControlButtons/ControlButtons";

export default function Game({
  gameState,
}: {
  gameState: GameState;
}): JSX.Element {
  const active = gameState.player.name === gameState.activePlayer;

  const {
    placedLetters,
    placeLetter,
    clearLetters,
    removeLetter,
  } = usePlacedLetters();

  // TODO move into hook
  const [
    selectedLetterIndex,
    setSelectedLetterIndex,
  ] = useState<RackIndex | null>(null);

  const placeSelectedLetter = (location: Location) => {
    // todo could also skip if the letter is already at the location (double-clicking)
    if (selectedLetterIndex === null) {
      return;
    }

    placeLetter(selectedLetterIndex, location);
  };

  const reRackLetter = () => {
    if (
      selectedLetterIndex === null ||
      // Nothing to do if the selected letter is already in the rack
      placedLetters[selectedLetterIndex] === null
    ) {
      return;
    }

    removeLetter(selectedLetterIndex);
  };

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
