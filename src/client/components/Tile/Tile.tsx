import React from "react";

import { Letter, LETTER_VALUES } from "../../Constants";
import "./Tile.css";

export function PresentationalTile({
  letter,
  className,
  onClick,
}: {
  letter: Letter;
  className?: string;
  onClick?: () => void;
}): JSX.Element {
  const classNames = `tile ${className || ""}`;

  if (letter === Letter.BLANK) {
    return <span className={classNames} onClick={onClick} />;
  }
  return (
    <span className={classNames} onClick={onClick}>
      {letter}
      <span className="tile-points">{LETTER_VALUES[letter]}</span>
    </span>
  );
}
