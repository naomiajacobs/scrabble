import React, { useEffect } from "react";

import {
  FinishedGameState,
  GameState,
  Letter,
  MoveType,
  PlacedLetter,
  PlayMove,
} from "../../Constants";
import { getDerivedBoard } from "../../util";
import Rack from "../Rack/Rack";
import ScrabbleBoard from "../ScrabbleBoard/ScrabbleBoard";
import ControlButtons from "../ControlButtons/ControlButtons";
import useGameLetters from "../../state/useGameLetters";
import { makeMove } from "../../api";
import usePrevious from "../../state/usePrevious";
import GameLog from "../GameLog/GameLog";

import "./Game.css";
import GameSummary from "../GameSummary/GameSummary";

export default function Game({
  gameState,
  gameOver,
}: {
  gameState: GameState;
  gameOver: boolean;
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
    const lettersPlaced: Array<PlacedLetter> = placedLetters
      .map((location, i) => {
        if (!location) {
          return null;
        }
        const letter = gameState.player.rack[i];
        let letterSpec;
        if (letter === Letter.BLANK) {
          const blankSpecifier = window.prompt(
            `What letter is the blank at (${location[0]},${location[1]})?`
          );
          letterSpec = [letter, location, blankSpecifier!.toUpperCase()];
        } else {
          letterSpec = [letter, location, null];
        }
        return letterSpec;
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
      {gameOver ? (
        <GameSummary gameState={gameState as FinishedGameState} />
      ) : (
        <h2>
          Hi, {gameState.player.name}! It's{" "}
          {active ? "your" : `${gameState.activePlayer}'s`} turn
        </h2>
      )}
      <div className="game-area">
        <div className="left-panel">
          <GameLog gameState={gameState} gameOver={gameOver} />
        </div>
        <div className="play-area">
          {!gameOver && (
            <ControlButtons
              active={active}
              clearLetters={clearLetters}
              reRackLetter={reRackLetter}
              hasPlacedLetters={placedLetters.filter((l) => l).length > 0}
              onSubmit={submit}
            />
          )}
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
