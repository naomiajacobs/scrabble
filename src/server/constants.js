// Players
const NAOMI = "Naomi";
const MERT = "Mert";

const SERVER_STATUS = "SERVER_STATUS";
const IN_PROGRESS = "IN_PROGRESS";
const INITIALIZE = "INITIALIZE";
const MAKE_MOVE = "MAKE_MOVE";
const CHALLENGE = "CHALLENGE";
const GAME_ERROR = "GAME_ERROR";
const GAME_OVER = "GAME_OVER";
const PROMPT_ABANDON = "PROMPT_ABANDON";
const GET_ABANDON_CONFIRMATION = "GET_ABANDON_CONFIRMATION";
const CONFIRM_ABANDON = "CONFIRM_ABANDON";
const REJECT_ABANDON = "REJECT_ABANDON";
const ABANDON_NOTIFICATION = "ABANDON_NOTIFICATION";
const INTRUDER = "INTRUDER";

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
  SERVER_STATUS,
  IN_PROGRESS,
  INITIALIZE,
  MAKE_MOVE,
  CHALLENGE,
  GAME_ERROR,
  GAME_OVER,
  PROMPT_ABANDON,
  GET_ABANDON_CONFIRMATION,
  CONFIRM_ABANDON,
  REJECT_ABANDON,
  ABANDON_NOTIFICATION,
  INTRUDER,
};
