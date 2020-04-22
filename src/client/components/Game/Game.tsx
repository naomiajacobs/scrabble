import React, { useEffect } from "react";

import { GameState, MoveType, PlacedLetter, PlayMove } from "../../Constants";
import { getDerivedBoard } from "../../util";
import Rack from "../Rack/Rack";
import ScrabbleBoard from "../ScrabbleBoard/ScrabbleBoard";
import ControlButtons from "../ControlButtons/ControlButtons";
import useGameLetters from "../../state/useGameLetters";
import { makeMove } from "../../api";
import usePrevious from "../../state/usePrevious";
import GameLog from "../GameLog/GameLog";

import './Game.css';

export default function Game({
  gameState,
}: {
  gameState: GameState;
}): JSX.Element {
  const previousState = usePrevious<GameState>(gameState);
  const active = gameState.player.name === gameState.activePlayer;

  const {
    placedLetters,
    clearLetters,
    reRackLetter,
    selectedLetterIndex,
    setSelectedLetterIndex,
    placeSelectedLetter,
    reset,
  } = useGameLetters();

  useEffect(() => {
    if (
      previousState &&
      gameState.moves.length !== previousState.moves.length
    ) {
      reset();
    }
  });

  const submit = () => {
    // get submitted move
    // validate client-side? (maybe later)
    const lettersPlaced: Array<PlacedLetter> = placedLetters
      .map((letter, i) => {
        // TODO specify blanks
        return letter && [gameState.player.rack[i], letter, null];
      })
      .filter((l) => l) as Array<PlacedLetter>;
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
      <div className="game-area">
        <div className="log-area">
          <GameLog gameState={gameState} />
        </div>
        <div className="play-area">
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
            active={active}
          />
          <ScrabbleBoard
            board={getDerivedBoard(
              gameState.moves,
              placedLetters,
              gameState.player.rack
            )}
            placeLetter={active ? placeSelectedLetter : () => {}}
            setSelectedLetter={active ? setSelectedLetterIndex : () => {}}
            selectedLetter={selectedLetterIndex}
          />
        </div>
      </div>
    </div>
  );
}
