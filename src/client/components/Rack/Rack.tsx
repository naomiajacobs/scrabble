import React, {useState} from "react";

import {Letter} from "../../Constants";
import {RackTile} from "../Tile/Tile";
import './Rack.css';

export default function Rack({ tiles }: { tiles: Array<Letter> }): JSX.Element {
  const [selectedLetter, setSelectedLetter] = useState<number | null>(null);

  return (
    <div className="rack">
      {tiles.map((tile, i) => (
        <RackTile
          key={i}
          letter={tile}
          onSelect={() => {
            setSelectedLetter(i);
          }}
          selected={selectedLetter === i}
        />
      ))}
    </div>
  );
}