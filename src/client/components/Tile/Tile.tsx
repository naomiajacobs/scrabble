import React from "react";

import { Letter, LETTER_VALUES } from "../../Constants";
import "./Tile.css";

export function PresentationalTile({
  letter,
  className,
  onMouseDown,
  draggable,
}: {
  letter: Letter;
  className?: string;
  onMouseDown?: () => void;
  draggable: boolean;
}): JSX.Element {
  const classNames = `tile ${className || ""}`;
  const props = {
    className: classNames,
    onMouseDown,
    draggable,
  };

  if (letter === Letter.BLANK) {
    return <span {...props} />;
  }
  return (
    <span {...props}>
      {letter}
      <span className="tile-points">{LETTER_VALUES[letter]}</span>
    </span>
  );
}
