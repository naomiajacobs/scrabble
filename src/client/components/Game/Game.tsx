import React, { useState } from "react";

import "./Game.css";
import {
  GameState,
  Letter,
  LETTER_VALUES,
  SQUARES_BY_LOCATION,
  TILE_NAME,
} from "../../Constants";

function EmptySquare({ row, col }: { row: number; col: number }): JSX.Element {
  const locationKey = `${row},${col}`;
  const specialTileClassName = SQUARES_BY_LOCATION[locationKey] || "";
  return (
    <span className={`square ${specialTileClassName}`} data-row={row} data-col={col}>
      {specialTileClassName ? TILE_NAME[specialTileClassName] : ""}
    </span>
  );
}

function Board(): JSX.Element {
  const board = Array(15).fill(Array(15).fill({}));
  return (
    <div className="board">
      {board.map((row, rowIndex) => {
        return (
          <div className="row" key={rowIndex}>
            {row.map((square: {}, colIndex: number) => (
              <EmptySquare key={colIndex} row={rowIndex} col={colIndex} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function Tile({
  letter,
  onSelect,
  selected,
}: {
  letter: Letter;
  selected: boolean;
  onSelect: () => void;
}): JSX.Element {
  if (letter === Letter.BLANK) {
    return (
      <span
        className={`tile ${selected ? "selected" : ""}`}
        onClick={onSelect}
      />
    );
  }

  return (
    <span className={`tile ${selected ? "selected" : ""}`} onClick={onSelect}>
      {letter}
      <span className="tile-points">{LETTER_VALUES[letter]}</span>
    </span>
  );
}

function Rack({ tiles }: { tiles: Array<Letter> }): JSX.Element {
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  return (
    <div className="rack">
      {tiles.map((tile, i) => (
        <Tile
          key={i}
          letter={tile}
          onSelect={() => {
            setSelectedLetter(i);
          }}
          selected={selectedLetter === i}
        />
      ))}
    </div>
  );
}

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
      <Board />
    </div>
  );
}
