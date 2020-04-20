import React, { useState } from "react";

import { GameState, Location, RackIndex } from "../../Constants";
import { getDeriveBoard } from "../../util";
import Rack from "../Rack/Rack";
import ScrabbleBoard from "../ScrabbleBoard/ScrabbleBoard";
import usePlacedLetters, {
  PlacedLettersState,
} from "../../state/usePlacedLetters";
import "./Game.css";

function ControlButtons({
  active,
  placedLetters,
  clearLetters,
  reRackLetter,
}: {
  active: boolean;
  placedLetters: PlacedLettersState;
  clearLetters: () => void;
  reRackLetter: () => void;
}): JSX.Element {
  return (
    <div className="control-buttons">
      <button
        type="button"
        onClick={() => {}}
        disabled={!active || placedLetters.filter((l) => l).length < 1}
      >
        Submit
      </button>
      <button
        type="button"
        onClick={reRackLetter}
        disabled={!active || placedLetters.filter((l) => l).length < 1}
      >
        Re-rack Letter
      </button>
      <button type="button" onClick={() => {}} disabled={!active}>
        Pass
      </button>
      <button type="button" onClick={() => {}} disabled={!active}>
        Dump
      </button>
      <button
        className="challenge"
        type="button"
        onClick={() => {}}
        disabled={!active}
      >
        Challenge
      </button>
      <button
        className="clear"
        type="button"
        onClick={clearLetters}
        disabled={!active}
      >
        Clear
      </button>
    </div>
  );
}

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
