import React from "react";

import { Board, Letter, SQUARES_BY_LOCATION, TILE_NAME } from "../../Constants";
import { PresentationalTile } from "../Tile/Tile";
import './ScrabbleBoard.css';

function EmptySquare({ row, col }: { row: number; col: number }): JSX.Element {
  const locationKey = `${row},${col}`;
  const specialTileClassName = SQUARES_BY_LOCATION[locationKey] || "";
  return (
    <span
      className={`square ${specialTileClassName}`}
      data-row={row}
      data-col={col}
    >
      {specialTileClassName ? TILE_NAME[specialTileClassName] : ""}
    </span>
  );
}

export default function ScrabbleBoard({
  board,
}: {
  board: Board;
}): JSX.Element {
  return (
    <div className="board">
      {board.map((row, rowIndex) => {
        return (
          <div className="row" key={rowIndex}>
            {row.map((letter: Letter | null, colIndex: number) =>
              letter ? (
                <PresentationalTile key={colIndex} letter={letter} />
              ) : (
                <EmptySquare key={colIndex} row={rowIndex} col={colIndex} />
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
