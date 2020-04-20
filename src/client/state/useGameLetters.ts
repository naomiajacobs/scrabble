import { useState } from "react";
import { Location, RackIndex } from "../Constants";
import usePlacedLetters from "./usePlacedLetters";

export default function useGameLetters() {
  const [
    selectedLetterIndex,
    setSelectedLetterIndex,
  ] = useState<RackIndex | null>(null);

  const {
    placedLetters,
    placeLetter,
    clearLetters,
    removeLetter,
  } = usePlacedLetters();

  const placeSelectedLetter = (location: Location) => {
    // TODO could also skip if the letter is already at the location (double-clicking)
    if (selectedLetterIndex === null) {
      return;
    }

    placeLetter(selectedLetterIndex, location);
  };

  const reRackLetter = () => {
    if (
      selectedLetterIndex === null ||
      // Nothing to do if the selected letter is already in the rack
      placedLetters[selectedLetterIndex] === null
    ) {
      return;
    }

    removeLetter(selectedLetterIndex);
  };

  const reset = () => {
    setSelectedLetterIndex(null);
    clearLetters();
  };

  return {
    placedLetters,
    clearLetters,
    reRackLetter,
    selectedLetterIndex,
    setSelectedLetterIndex,
    placeSelectedLetter,
    reset
  };
}
