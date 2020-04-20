import React from "react";

import "./ControlButtons.css";

export default function ControlButtons({
  active,
  clearLetters,
  reRackLetter,
  hasPlacedLetters,
  onSubmit,
}: {
  active: boolean;
  hasPlacedLetters: boolean;
  clearLetters: () => void;
  reRackLetter: () => void;
  onSubmit: () => void;
}): JSX.Element {
  return (
    <div className="control-buttons">
      <button
        type="button"
        disabled={!active || !hasPlacedLetters}
        onClick={onSubmit}
      >
        Submit
      </button>
      <button
        type="button"
        onClick={reRackLetter}
        disabled={!active || !hasPlacedLetters}
      >
        Re-rack Letter
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
