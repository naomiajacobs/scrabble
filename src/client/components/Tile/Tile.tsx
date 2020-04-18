import React from "react";

import {Letter, LETTER_VALUES} from "../../Constants";
import './Tile.css';

function getBackgroundImageClass(letter: Letter): string {
  return `backgroundImage-${(LETTER_VALUES[letter] % 4) + 1}`;
}

export function PresentationalTile({
  letter,
  className,
  onClick,
}: {
  letter: Letter;
  className?: string;
  onClick?: () => void;
}): JSX.Element {
  if (letter === Letter.BLANK) {
    return <span className={`tile ${className || ""} ${getBackgroundImageClass(letter)}`} onClick={onClick} />;
  }
  return (
    <span
      className={`tile ${className || ""} ${getBackgroundImageClass(letter)}`}
      onClick={onClick}
    >
      {letter}
      <span className="tile-points">{LETTER_VALUES[letter]}</span>
    </span>
  );
}

export function RackTile({
  letter,
  onSelect,
  selected,
}: {
  letter: Letter;
  selected: boolean;
  onSelect: () => void;
}): JSX.Element {
  return (
    <PresentationalTile
      letter={letter}
      className={selected ? "selected" : ""}
      onClick={onSelect}
    />
  );
}