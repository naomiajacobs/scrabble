import React from "react";

import "./ControlButtons.css";

export default function ControlButtons({
  active,
  clearLetters,
  reRackLetter,
  hasSubmittableLetters,
  onSubmit,
  toggleDumping,
  dumping,
  challengable,
}: {
  active: boolean;
  hasSubmittableLetters: boolean;
  clearLetters: () => void;
  reRackLetter: () => void;
  onSubmit: () => void;
  toggleDumping: () => void;
  dumping: boolean;
  challengable: boolean;
}): JSX.Element {
  return (
    <div className="control-buttons">
      <button
        type="button"
        disabled={!active || !hasSubmittableLetters}
        onClick={onSubmit}
        className="small"
      >
        Submit
      </button>
      <button
        type="button"
        className="small"
        onClick={reRackLetter}
        disabled={dumping || !active || (!dumping && !hasSubmittableLetters)}
      >
        Re-rack Letter
      </button>
      <button
        type="button"
        className="small"
        onClick={toggleDumping}
        disabled={!active}
      >
        {dumping ? "Cancel Dump" : "Dump"}
      </button>
      <button
        className="challenge small"
        type="button"
        onClick={() => {}}
        disabled={!active || !challengable}
      >
        Challenge
      </button>
      <button
        className="danger small"
        type="button"
        onClick={clearLetters}
        disabled={dumping || !active || !hasSubmittableLetters}
      >
        Clear
      </button>
    </div>
  );
}
