import React from "react";

import {
  Board,
  Letter,
  Location,
  SQUARES_BY_LOCATION,
  TILE_NAME,
} from "../../Constants";
import { PresentationalTile } from "../Tile/Tile";
import "./ScrabbleBoard.css";

function EmptySquare({
  row,
  col,
  onClick,
}: {
  row: number;
  col: number;
  onClick: () => void;
}): JSX.Element {
  const locationKey = `${row},${col}`;
  const specialTileClassName = SQUARES_BY_LOCATION[locationKey] || "";
  return (
    <span
      className={`square ${specialTileClassName}`}
      data-row={row}
      data-col={col}
      onClick={onClick}
    >
      {specialTileClassName ? TILE_NAME[specialTileClassName] : ""}
    </span>
  );
}

export default function ScrabbleBoard({
  board,
  placeLetter,
}: {
  board: Board;
  placeLetter: (location: Location) => void;
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
                <EmptySquare
                  key={colIndex}
                  row={rowIndex}
                  col={colIndex}
                  onClick={() => {
                    placeLetter([rowIndex, colIndex]);
                  }}
                />
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
