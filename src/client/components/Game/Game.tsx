import React, { useEffect } from "react";

import letterBag from '../../../assets/images/crown-royal.jpg';

import {
  DumpMove,
  FinishedGameState,
  GameState,
  Letter,
  MoveType,
  PlacedLetter,
  PlayMove,
  Rack as RackType,
  RackIndex,
} from "../../Constants";
import { getDerivedBoard } from "../../util";
import Rack, { DumpRack } from "../Rack/Rack";
import ScrabbleBoard from "../ScrabbleBoard/ScrabbleBoard";
import ControlButtons from "../ControlButtons/ControlButtons";
import useGameLetters from "../../state/useGameLetters";
import { makeMove, promptAbandon } from "../../api";
import usePrevious from "../../state/usePrevious";
import GameLog from "../GameLog/GameLog";

import "./Game.css";
import GameSummary from "../GameSummary/GameSummary";
import { PlacedLettersState } from "../../state/usePlacedLetters";
import useDumping from "../../state/useDumpLetters";

function AbandonGameButton(): JSX.Element {
  return (
    <button
      className="danger medium abandon-game"
      type="button"
      onClick={() => {
        promptAbandon();
      }}
    >
      Abandon Game
    </button>
  );
}

function ManagedRack({
  tiles,
  selectedLetterIndex,
  active,
  placedLetters,
  setSelectedLetterIndex,
  dumping,
  tilesToDump,
  toggleTile,
}: {
  tiles: RackType;
  selectedLetterIndex: RackIndex | null;
  active: boolean;
  placedLetters: PlacedLettersState;
  setSelectedLetterIndex: (i: RackIndex) => void;
  dumping: boolean;
  tilesToDump: Array<RackIndex>;
  toggleTile: (i: RackIndex) => void;
}): JSX.Element {

  if (!dumping) {
    return (
      <Rack
        tiles={tiles}
        selectedLetterIndex={selectedLetterIndex}
        setSelectedLetterIndex={active ? setSelectedLetterIndex : () => {}}
        placedLetters={placedLetters}
        active={active}
      />
    );
  }

  return (
    <>
      <p>Select which letters to dump: </p>
      <DumpRack
        tiles={tiles}
        selectedLetterIndices={tilesToDump}
        onToggleTile={toggleTile}
      />
    </>
  );
}

export default function Game({
  gameState,
  gameOver,
}: {
  gameState: GameState;
  gameOver: boolean;
}): JSX.Element {
  const previousGameState = usePrevious<GameState>(gameState);
  const active = gameState.player.name === gameState.activePlayer;
  const {dumping, setDumping, toggleTile, tilesToDump} = useDumping();
  const previousDumping = usePrevious(dumping);

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
    const gameStateChanged =
      previousGameState &&
      gameState.moves.length !== previousGameState.moves.length;
    const dumpingStateChanged = previousDumping !== dumping;

    if (gameStateChanged || dumpingStateChanged) {
      reset();
    }
  });

  const submit = () => {
    if (dumping) {
      const move: DumpMove = {
        playerName: gameState.player.name,
        type: MoveType.DUMP,
        lettersToDump: tilesToDump,
      };
      makeMove(move);
      setDumping(false);
    } else {
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
    }
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
          <AbandonGameButton />
          <GameLog gameState={gameState} gameOver={gameOver} />
        </div>
        <div className="play-area">
          {!gameOver && (
            <ControlButtons
              active={active}
              clearLetters={clearLetters}
              reRackLetter={reRackLetter}
              hasSubmittableLetters={
                dumping
                  ? tilesToDump.length > 0
                  : placedLetters.filter((l) => l).length > 0
              }
              onSubmit={submit}
              toggleDumping={() => {
                setDumping(!dumping);
              }}
              dumping={dumping}
            />
          )}
          <ManagedRack
            tiles={gameState.player.rack}
            selectedLetterIndex={selectedLetterIndex}
            setSelectedLetterIndex={active ? setSelectedLetterIndex : () => {}}
            placedLetters={placedLetters}
            active={active}
            dumping={dumping}
            tilesToDump={tilesToDump}
            toggleTile={toggleTile}
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
        <div className="right-panel">
          <img className="letter-bag" src={letterBag} />
          <span className="letters-left">{gameState.letterBag.length}</span>
        </div>
      </div>
    </div>
  );
}
