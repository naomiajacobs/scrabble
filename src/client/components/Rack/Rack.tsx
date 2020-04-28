import React from "react";

import {Letter, Rack as RackType, RackIndex} from "../../Constants";
import {PresentationalTile} from "../Tile/Tile";
import "./Rack.css";
import {PlacedLettersState} from "../../state/usePlacedLetters";

function RackTile({
  letter,
  onSelect,
  selected,
  active
}: {
  letter: Letter;
  selected: boolean;
  onSelect: () => void;
  active: boolean;
}): JSX.Element {
  return (
    <PresentationalTile
      letter={letter}
      className={selected ? "selected" : ""}
      onMouseDown={onSelect}
      draggable={active}
    />
  );
}

export default function Rack({
  tiles,
  selectedLetterIndex,
  setSelectedLetterIndex,
  placedLetters,
  active
}: {
  tiles: RackType;
  selectedLetterIndex: RackIndex | null;
  setSelectedLetterIndex(index: RackIndex): void;
  placedLetters: PlacedLettersState;
  active: boolean;
}): JSX.Element {
  return (
    <div className="rack">
      {tiles.map((tile, i) => {
        if (!placedLetters[i]) {
          return (
            <RackTile
              key={i}
              letter={tile}
              onSelect={() => {
                setSelectedLetterIndex(i as RackIndex);
              }}
              selected={selectedLetterIndex === i}
              active={active}
            />
          );
        }

        return <span key={i} />;
      })}
    </div>
  );
}
