// Players
const NAOMI = "Naomi";
const MERT = "Mert";

const IN_PROGRESS = "IN_PROGRESS";
const GAME_OVER = "GAME_OVER";
const INTRUDER = "INTRUDER";

const ChallengeStatus = {
  UNRESOLVED_UNCHALLENGED: "UNRESOLVED_UNCHALLENGED",
  RESOLVED_ACCEPTED: "RESOLVED_ACCEPTED",
  UNRESOLVED_CHALLENGED: "UNRESOLVED_CHALLENGED",
  RESOLVED_INVALID: "RESOLVED_INVALID",
  RESOLVED_VALID: "RESOLVED_VALID",
};

const GameEvent = {
  INITIALIZE: "INITIALIZE",
  SERVER_STATUS: "SERVER_STATUS",
  MAKE_MOVE: "MAKE_MOVE",
  GAME_ERROR: "GAME_ERROR",
  PROMPT_ABANDON: "PROMPT_ABANDON",
  GET_ABANDON_CONFIRMATION: "GET_ABANDON_CONFIRMATION",
  CONFIRM_ABANDON: "CONFIRM_ABANDON",
  REJECT_ABANDON: "REJECT_ABANDON",
  ABANDON_NOTIFICATION: "ABANDON_NOTIFICATION",
  ACCEPT_MOVE: "ACCEPT_MOVE",
  CHALLENGE_MOVE: "CHALLENGE_MOVE",
  CHALLENGE_RESOLVED: "CHALLENGE_RESOLVED",
  RESUME_GAME_FROM_JSON: "RESUME_GAME_FROM_JSON",
  START_NEW_GAME: "START_NEW_GAME",
};

const ChallengeResolution = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};

// Move Type
const PLAY = "PLAY";
const PASS = "PASS";
const DUMP = "DUMP";

const LETTER = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  H: "H",
  I: "I",
  J: "J",
  K: "K",
  L: "L",
  M: "M",
  N: "N",
  O: "O",
  P: "P",
  Q: "Q",
  R: "R",
  S: "S",
  T: "T",
  U: "U",
  V: "V",
  W: "W",
  X: "X",
  Y: "Y",
  Z: "Z",
  BLANK: "BLANK",
};

const LETTER_FREQUENCIES = {
  A: 9,
  B: 2,
  C: 2,
  D: 4,
  E: 12,
  F: 2,
  G: 3,
  H: 2,
  I: 9,
  J: 1,
  K: 1,
  L: 4,
  M: 2,
  N: 6,
  O: 8,
  P: 2,
  Q: 1,
  R: 6,
  S: 4,
  T: 6,
  U: 4,
  V: 2,
  W: 2,
  X: 1,
  Y: 2,
  Z: 1,
  BLANK: 2,
};

module.exports = {
  NAOMI,
  MERT,
  LETTER,
  LETTER_FREQUENCIES,
  PLAY,
  PASS,
  DUMP,
  IN_PROGRESS,
  GAME_OVER,
  INTRUDER,
  ChallengeStatus,
  GameEvent,
  ChallengeResolution,
};
