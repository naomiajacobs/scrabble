import { useEffect, useState } from "react";
import { RackIndex } from "../Constants";

export default function useDumping() {
  const [dumping, setDumping] = useState(false);
  const [tilesToDump, setTilesToDump] = useState<Array<RackIndex>>([]);

  const toggleTile = (i: RackIndex) => {
    if (tilesToDump.includes(i)) {
      tilesToDump.splice(tilesToDump.indexOf(i), 1);
      setTilesToDump([...tilesToDump]);
    } else {
      const indices = [...tilesToDump, i];
      setTilesToDump(indices);
    }
  };

  // Don't save dumping state after dump is canceled
  useEffect(() => {
    if (!dumping && tilesToDump.length > 0) {
      setTilesToDump([]);
    }
  }, [dumping, tilesToDump.length]);

  return {
    dumping,
    setDumping,
    toggleTile,
    tilesToDump,
  };
}
