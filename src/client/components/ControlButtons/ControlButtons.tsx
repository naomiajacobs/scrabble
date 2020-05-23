import React from "react";

import { ActionState } from "../../Constants";
import "./ControlButtons.css";

function ChallengeResolutionButtons({
  onMoveInvalidated,
  onMoveValidated,
}: {
  onMoveValidated: () => void;
  onMoveInvalidated: () => void;
}): JSX.Element {
  return (
    <div className="control-buttons">
      <button className="small" type="button" onClick={onMoveValidated}>
        Move is valid
      </button>
      <button
        className="danger small"
        type="button"
        onClick={onMoveInvalidated}
      >
        Move is invalid
      </button>
    </div>
  );
}

function EndMoveButtons({
  onChallenge,
  onAccept,
}: {
  onChallenge: () => void;
  onAccept: () => void;
}): JSX.Element {
  return (
    <div className="control-buttons">
      <div className="end-move">
        <button className="small" type="button" onClick={onAccept}>
          Accept Move
        </button>
        <button className="danger small" type="button" onClick={onChallenge}>
          Challenge Move
        </button>
      </div>
    </div>
  );
}

function StandardButtons({
  clearLetters,
  dumping,
  hasSubmittableLetters,
  active,
  onSubmit,
  reRackLetter,
  toggleDumping,
}: {
  clearLetters: () => void;
  dumping: boolean;
  hasSubmittableLetters: boolean;
  active: boolean;
  onSubmit: () => void;
  reRackLetter: () => void;
  toggleDumping: () => void;
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

export default function ControlButtons({
  actionState,
  clearLetters,
  reRackLetter,
  hasSubmittableLetters,
  onSubmit,
  toggleDumping,
  dumping,
  onChallenge,
  onAccept,
  onMoveValidated,
  onMoveInvalidated,
}: {
  actionState: ActionState;
  hasSubmittableLetters: boolean;
  clearLetters: () => void;
  reRackLetter: () => void;
  onSubmit: () => void;
  toggleDumping: () => void;
  dumping: boolean;
  onChallenge: () => void;
  onAccept: () => void;
  onMoveValidated: () => void;
  onMoveInvalidated: () => void;
}): JSX.Element {
  switch (actionState) {
    case ActionState.GO:
      return (
        <StandardButtons
          clearLetters={clearLetters}
          dumping={dumping}
          hasSubmittableLetters={hasSubmittableLetters}
          active={true}
          onSubmit={onSubmit}
          reRackLetter={reRackLetter}
          toggleDumping={toggleDumping}
        />
      );
    case ActionState.WAITING_FOR_OPPONENT_MOVE:
    case ActionState.WAITING_FOR_CHALLENGE_OR_DRAW:
      return (
        <StandardButtons
          clearLetters={clearLetters}
          dumping={dumping}
          hasSubmittableLetters={hasSubmittableLetters}
          active={false}
          onSubmit={onSubmit}
          reRackLetter={reRackLetter}
          toggleDumping={toggleDumping}
        />
      );
    case ActionState.CHALLENGE_OR_DRAW:
      return <EndMoveButtons onChallenge={onChallenge} onAccept={onAccept} />;
    case ActionState.AWAITING_CHALLENGE_RESOLUTION:
      return (
        <ChallengeResolutionButtons
          onMoveInvalidated={onMoveInvalidated}
          onMoveValidated={onMoveValidated}
        />
      );
  }
}
