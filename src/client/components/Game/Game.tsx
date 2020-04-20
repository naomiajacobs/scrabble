import React from "react";

import { GameState, MoveType, PlacedLetter, PlayMove } from "../../Constants";
import { getDeriveBoard } from "../../util";
import Rack from "../Rack/Rack";
import ScrabbleBoard from "../ScrabbleBoard/ScrabbleBoard";
import ControlButtons from "../ControlButtons/ControlButtons";
import useGameLetters from "../../state/useGameLetters";
import { makeMove } from "../../api";

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

  const submit = () => {
    // get submitted move
    // validate client-side? (maybe later)
    const lettersPlaced: Array<PlacedLetter> = (placedLetters
      .map((letter, i) => {
        // TODO specify blanks
        return letter && [gameState.player.rack[i], letter, null];
      })
      .filter((l) => l) as Array<PlacedLetter>);
    const move: PlayMove = {
      playerName: gameState.player.name,
      type: MoveType.PLAY,
      lettersPlaced,
    };
    makeMove(move);
  };

  return (
    <div className="game">
      <h2>
        Hi, {gameState.player.name}! It's{" "}
        {active ? "your" : `${gameState.activePlayer}'s`} turn
      </h2>
      <ControlButtons
        active={active}
        clearLetters={clearLetters}
        reRackLetter={reRackLetter}
        hasPlacedLetters={placedLetters.filter((l) => l).length > 0}
        onSubmit={submit}
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
