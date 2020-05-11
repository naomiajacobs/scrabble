import React, { useEffect } from "react";

import letterBag from "../../../assets/images/crown_royale_transparent.png";

import {
  ActionState,
  ChallengeStatus,
  DumpMove,
  GameState,
  Letter,
  MoveType,
  PlacedLetter,
  PlayMove,
  Rack as RackType,
  RackIndex,
} from "../../Constants";
import {
  getActionState,
  getDerivedBoard,
  getLastMove,
  isYourTurn,
} from "../../util";
import Rack, { DumpRack } from "../Rack/Rack";
import ScrabbleBoard from "../ScrabbleBoard/ScrabbleBoard";
import ControlButtons from "../ControlButtons/ControlButtons";
import useGameLetters from "../../state/useGameLetters";
import {
  acceptMove,
  challengeMove,
  makeMove,
  resolveChallenge,
} from "../../api";
import usePrevious from "../../state/usePrevious";
import GameLog from "../GameLog/GameLog";

import "./Game.css";
import { PlacedLettersState } from "../../state/usePlacedLetters";
import useDumping from "../../state/useDumpLetters";

// Toggles between playing and dumping
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
  console.log("letterbag: ", letterBag);

  const previousGameState = usePrevious<GameState>(gameState);
  const active = isYourTurn(gameState);
  const { dumping, setDumping, toggleTile, tilesToDump } = useDumping();
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
    let receivedNewMove = false;
    let moveChanged = false;
    if (previousGameState) {
      receivedNewMove =
        gameState.moves.length !== previousGameState.moves.length;
      if (!receivedNewMove) {
        const oldLastMove = getLastMove(previousGameState);
        const newLastMove = getLastMove(gameState);
        moveChanged = Boolean(
          oldLastMove &&
            newLastMove &&
            // Technically not correct, but other move types will just have undefined
            (oldLastMove as PlayMove).challengeStatus !==
              (newLastMove as PlayMove).challengeStatus
        );
      }
    }

    const dumpingStateChanged = previousDumping !== dumping;

    if (receivedNewMove || moveChanged || dumpingStateChanged) {
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
        challengeStatus: ChallengeStatus.UNRESOLVED_UNCHALLENGED,
      };
      makeMove(move);
    }
  };

  const actionState = getActionState(gameState);

  return (
    <div className="game">
      <div className="left-panel">
        <GameLog gameState={gameState} gameOver={gameOver} />
      </div>
      <div className="play-area">
        {!gameOver && (
          <ControlButtons
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
            onChallenge={() => {
              challengeMove(gameState.player.name);
            }}
            onAccept={() => {
              acceptMove(gameState.player.name);
            }}
            actionState={actionState}
            onMoveInvalidated={() =>
              resolveChallenge(ChallengeStatus.RESOLVED_INVALID)
            }
            onMoveValidated={() =>
              resolveChallenge(ChallengeStatus.RESOLVED_VALID)
            }
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
          highlightLastMove={[
            ActionState.AWAITING_CHALLENGE_RESOLUTION,
            ActionState.WAITING_FOR_CHALLENGE_OR_DRAW,
            ActionState.CHALLENGE_OR_DRAW,
          ].includes(actionState)}
        />
      </div>
      <div className="right-panel">
        <div
          className="letters-left"
          style={{ backgroundImage: `url("${letterBag}")` }}
        >
          {gameState.letterBag.length}
        </div>
      </div>
    </div>
  );
}
