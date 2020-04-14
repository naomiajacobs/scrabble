import React from "react";

import "./Game.css";
import {
  Letter,
  LETTER_VALUES,
  SQUARES_BY_LOCATION,
  TILE_NAME,
} from "../../Constants";
import { GameState } from "../../gameLogic";

function EmptySquare({ x, y }: { x: number; y: number }): JSX.Element {
  const locationKey = `${x},${y}`;
  const specialTileClassName = SQUARES_BY_LOCATION[locationKey] || "";
  return (
    <span className={`square ${specialTileClassName}`}>
      {specialTileClassName ? TILE_NAME[specialTileClassName] : ""}
    </span>
  );
}

function Board(): JSX.Element {
  const board = Array(15).fill(Array(15).fill({}));
  return (
    <div className="board">
      {board.map((row, i) => {
        return (
          <div className="row" key={i}>
            {row.map((square: {}, j: number) => (
              <EmptySquare key={j} x={i} y={j} />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function Tile({ letter }: { letter: Letter }): JSX.Element {
  return (
    <span className="tile">
      {letter}
      <span className="tile-points">{LETTER_VALUES[letter]}</span>
    </span>
  );
}

function Rack({ tiles }: { tiles: Array<Letter> }): JSX.Element {
  return (
    <div className="rack">
      {tiles.map((tile, i) => (
        <Tile key={i} letter={tile} />
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
      <Rack tiles={gameState.players[0].rack} />
      <Board />
    </div>
  );
}
