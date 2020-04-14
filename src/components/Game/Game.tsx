import React from "react";

import "./Game.css";
import { SQUARES_BY_LOCATION, TILE_NAME } from "../../Constants";

function EmptySquare({ x, y }: { x: number; y: number }): JSX.Element {
  const locationKey = `${x},${y}`;
  const specialTileClassName = SQUARES_BY_LOCATION[locationKey] || "";
  return (
    <span className={`tile ${specialTileClassName}`} key={y}>
      {specialTileClassName ? TILE_NAME[specialTileClassName] : ""}
    </span>
  );
}

export default function Game(): JSX.Element {
  const board = Array(15).fill(Array(15).fill({}));
  return (
    <div className="board">
      {board.map((row, i) => {
        return (
          <div className="row" key={i}>
            {row.map((square: {}, j: number) => <EmptySquare x={i} y={j}/>)}
          </div>
        );
      })}
    </div>
  );
}
