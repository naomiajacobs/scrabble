import React from "react";

import { Letter, Rack as RackType, RackIndex } from "../../Constants";
import { PresentationalTile } from "../Tile/Tile";
import "./Rack.css";
import { PlacedLettersState } from "../../state/usePlacedLetters";

import rackImage from "../../../assets/images/rack.png";

function RackTile({
  letter,
  onSelect,
  selected,
  active,
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

function DumpTile({
  letter,
  selected,
  onClick,
}: {
  letter: Letter;
  selected: boolean;
  onClick: () => void;
}): JSX.Element {
  return (
    <PresentationalTile
      letter={letter}
      draggable={false}
      className={selected ? "selected" : ""}
      onClick={onClick}
    />
  );
}

function RackContainer({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="rack-container">
      <div className="rack" style={{ backgroundImage: `url("${rackImage}")` }}>
        {children}
      </div>
    </div>
  );
}

export default function Rack({
  tiles,
  selectedLetterIndex,
  setSelectedLetterIndex,
  placedLetters,
  active,
}: {
  tiles: RackType;
  selectedLetterIndex: RackIndex | null;
  setSelectedLetterIndex(index: RackIndex): void;
  placedLetters: PlacedLettersState;
  active: boolean;
}): JSX.Element {
  return (
    <RackContainer>
      {tiles
        .filter((t) => t)
        .map((tile, i) => {
          if (!placedLetters[i]) {
            return (
              <RackTile
                key={i}
                letter={tile as Letter}
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
    </RackContainer>
  );
}

export function DumpRack({
  tiles,
  selectedLetterIndices,
  onToggleTile,
}: {
  tiles: RackType;
  selectedLetterIndices: Array<RackIndex>;
  onToggleTile(index: RackIndex): void;
}): JSX.Element {
  return (
    <RackContainer>
      {tiles
        .filter((t) => t)
        .map((tile, i) => (
          <DumpTile
            key={i}
            letter={tile as Letter}
            selected={selectedLetterIndices.includes(i as RackIndex)}
            onClick={() => {
              onToggleTile(i as RackIndex);
            }}
          />
        ))}
    </RackContainer>
  );
}
