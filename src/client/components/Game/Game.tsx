import React, { useEffect } from "react";

import letterBag from "../../../assets/images/crown-royal.jpg";

import {
  ActionState,
  ChallengeStatus,
  DumpMove,
  FinishedGameState,
  GameState,
  Letter,
  MoveType,
  PlacedLetter,
  PlayerName,
  PlayMove,
  Rack as RackType,
  RackIndex,
} from "../../Constants";
import {
  getActionState,
  getDerivedBoard,
  getLastMove,
  getOtherPlayer,
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
  promptAbandon,
  resolveChallenge,
} from "../../api";
import usePrevious from "../../state/usePrevious";
import GameLog from "../GameLog/GameLog";

import "./Game.css";
import GameSummary from "../GameSummary/GameSummary";
import { PlacedLettersState } from "../../state/usePlacedLetters";
import useDumping from "../../state/useDumpLetters";

function Title({
  actionState,
  yourName,
  opponentName,
}: {
  actionState: ActionState;
  yourName: PlayerName;
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
  return (
    <>
      <h2>Hi, {yourName}!</h2>
      <h3>{text}</h3>
    </>
  );
}

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
      {gameOver ? (
        <GameSummary gameState={gameState as FinishedGameState} />
      ) : (
        <Title
          actionState={actionState}
          yourName={gameState.player.name}
          opponentName={getOtherPlayer(gameState.player.name)}
        />
      )}
      <div className="game-area">
        <div className="left-panel">
          <AbandonGameButton />
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
