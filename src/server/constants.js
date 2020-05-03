// Players
const NAOMI = "Naomi";
const MERT = "Mert";

const SERVER_STATUS = "server status";
const IN_PROGRESS = "in progress";
const INITIALIZE = "initialize";
const MAKE_MOVE = "make move";
const CHALLENGE = "challenge";
const GAME_ERROR = "game error";
const GAME_OVER = "game over";
const PROMPT_ABANDON = "prompt abandon";
const GET_ABANDON_CONFIRMATION = "get abandon confirmation";
const CONFIRM_ABANDON = "confirm abandon";
const REJECT_ABANDON = "reject abandon";
const ABANDON_NOTIFICATION = "abandon notification";

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
};
