import React from "react";

import {PlacedLettersState} from "../../state/usePlacedLetters";

import "./ControlButtons.css";

export default function ControlButtons({
  active,
  placedLetters,
  clearLetters,
  reRackLetter,
}: {
  active: boolean;
  placedLetters: PlacedLettersState;
  clearLetters: () => void;
  reRackLetter: () => void;
}): JSX.Element {
  return (
    <div className="control-buttons">
      <button
        type="button"
        onClick={() => {}}
        disabled={!active || placedLetters.filter((l) => l).length < 1}
      >
        Submit
      </button>
      <button
        type="button"
        onClick={reRackLetter}
        disabled={!active || placedLetters.filter((l) => l).length < 1}
      >
        Re-rack Letter
      </button>
      <button type="button" onClick={() => {}} disabled={!active}>
        Pass
      </button>
      <button type="button" onClick={() => {}} disabled={!active}>
        Dump
      </button>
      <button
        className="challenge"
        type="button"
        onClick={() => {}}
        disabled={!active}
      >
        Challenge
      </button>
      <button
        className="clear"
        type="button"
        onClick={clearLetters}
        disabled={!active}
      >
        Clear
      </button>
    </div>
  );
}
