import React from "react";

import {
  Board,
  Letter,
  Location,
  SQUARES_BY_LOCATION,
  TILE_NAME,
  TileFromRack as TileFromRackType,
  RackIndex,
  PreviouslyPlayedTile,
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

function TileFromRack({
  letter,
  select,
  selected,
}: {
  letter: Letter;
  select: () => void;
  selected: boolean;
}): JSX.Element {
  return (
    <PresentationalTile
      letter={letter}
      className={`from-rack ${selected ? "selected" : ""}`}
      onClick={select}
    />
  );
}

export default function ScrabbleBoard({
  board,
  placeLetter,
  setSelectedLetter,
  selectedLetter,
}: {
  board: Board;
  placeLetter: (location: Location) => void;
  setSelectedLetter: (number: RackIndex) => void;
  selectedLetter: RackIndex | null;
}): JSX.Element {
  return (
    <div className="board">
      {board.map((row, rowIndex) => {
        return (
          <div className="row" key={rowIndex}>
            {row.map((square, colIndex: number) => {
              if (!square) {
                return (
                  <EmptySquare
                    key={colIndex}
                    row={rowIndex}
                    col={colIndex}
                    onClick={() => {
                      placeLetter([rowIndex, colIndex]);
                    }}
                  />
                );
              }

              if (square.fromRack) {
                const rackTile: TileFromRackType = square as TileFromRackType;
                return (
                  <TileFromRack
                    key={colIndex}
                    letter={rackTile.letter}
                    select={() => setSelectedLetter(rackTile.rackIndex)}
                    selected={selectedLetter === rackTile.rackIndex}
                  />
                );
              }

              return (
                <PresentationalTile
                  key={colIndex}
                  letter={(square as PreviouslyPlayedTile).letter}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
