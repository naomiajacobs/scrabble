import { useState } from "react";

import { Location } from "../Constants";

export type RackIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const initialState: PlacedLettersState = [null, null, null, null, null, null, null];

export type PlacedLettersState = [
  Location | null,
  Location | null,
  Location | null,
  Location | null,
  Location | null,
  Location | null,
  Location | null
];

export default function usePlacedLetters() {
  const [placedLetters, setPlacedLetters] = useState<PlacedLettersState>(initialState);

  const placeLetter = (index: RackIndex, location: Location): void => {
    const newLetters: PlacedLettersState = [...placedLetters] as PlacedLettersState;
    newLetters[index] = location;
    setPlacedLetters(newLetters);
  };

  const clearLetters = (): void => {
    setPlacedLetters(initialState);
  };

  const removeLetter = (index: RackIndex): void => {
    const newLetters: PlacedLettersState = [...placedLetters] as PlacedLettersState;
    newLetters[index] = null;
    setPlacedLetters(newLetters);
  };

  return { placedLetters, placeLetter, clearLetters, removeLetter };
}
