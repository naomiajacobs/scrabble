import { useState } from "react";

import {Location, RackIndex} from "../Constants";

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
