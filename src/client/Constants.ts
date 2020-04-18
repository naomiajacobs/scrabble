enum SpecialSquare {
  TRIPLE_LETTER = "tls",
  DOUBLE_LETTER = "dls",
  TRIPLE_WORD = "tws",
  DOUBLE_WORD = "dws",
}

export const TILE_NAME: { [key in SpecialSquare]: string } = {
  [SpecialSquare.TRIPLE_LETTER]: "Triple Letter Score",
  [SpecialSquare.DOUBLE_LETTER]: "Double Letter Score",
  [SpecialSquare.TRIPLE_WORD]: "Triple Word Score",
  [SpecialSquare.DOUBLE_WORD]: "Double Word Score",
};

const SQUARES: { [key in SpecialSquare]: Array<string> } = {
  [SpecialSquare.TRIPLE_WORD]: [
    "0,0",
    "0,7",
    "7,0",
    "14,7",
    "7,14",
    "0,14",
    "14,0",
    "14,14",
  ],
  [SpecialSquare.DOUBLE_WORD]: [
    "1,1",
    "2,2",
    "3,3",
    "4,4",
    "1,13",
    "2,12",
    "3,11",
    "4,10",
    "13,1",
    "12,2",
    "11,3",
    "10,4",
    "10,10",
    "11,11",
    "12,12",
    "13,13",
    "7,7",
  ],
  [SpecialSquare.DOUBLE_LETTER]: [
    "0,3",
    "0,11",
    "3,0",
    "3,14",
    "11,0",
    "14,3",
    "14,11",
    "11,14",
    "2,6",
    "3,7",
    "2,8",
    "6,2",
    "7,3",
    "8,2",
    "12,6",
    "11,7",
    "12,8",
    "6,12",
    "7,11",
    "8,12",
    "6,6",
    "6,8",
    "8,6",
    "8,8",
  ],
  [SpecialSquare.TRIPLE_LETTER]: [
    "1,5",
    "1,9",
    "5,13",
    "9,13",
    "5,1",
    "9,1",
    "13,5",
    "13,9",
    "5,5",
    "5,9",
    "9,5",
    "9,9",
  ],
};

export enum Letter {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
  F = "F",
  G = "G",
  H = "H",
  I = "I",
  J = "J",
  K = "K",
  L = "L",
  M = "M",
  N = "N",
  O = "O",
  P = "P",
  Q = "Q",
  R = "R",
  S = "S",
  T = "T",
  U = "U",
  V = "V",
  W = "W",
  X = "X",
  Y = "Y",
  Z = "Z",
  BLANK = "BLANK",
}

export const LETTER_VALUES: { [key in Letter]: number } = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 2,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
  BLANK: 0,
};

const LETTER_FREQUENCIES: { [key in Letter]: number } = {
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

export const SQUARES_BY_LOCATION: {
  [location: string]: SpecialSquare;
} = (Object.keys(SQUARES) as Array<SpecialSquare>).reduce(
  (hash: { [location: string]: SpecialSquare }, tileName: SpecialSquare) => {
    const locations = SQUARES[tileName];
    locations.forEach((location) => {
      hash[location] = tileName;
    });
    return hash;
  },
  {}
);
enum PlayerName {
  MERT = 'MERT',
  NAOMI = 'NAOMI',
}
interface Player {
  name: PlayerName;
  rack: Array<Letter>;
}
type PlacedLetter = [Letter, string, Letter | null];
interface Move {}
export interface GameState {
  player: Player;
  letterBag: Array<Letter>;
  moves: Array<Move>;
  activePlayer: PlayerName;
  derivedBoard: {[location: string]: PlacedLetter}
}

export enum CurrentGameStatus {
  FULL = "full",
  WAITING_ON_OPPONENT = "waiting on opponent",
  IN_PROGRESS = "in progress",
  FINISHED = "finished",
}

interface BaseServerStatus {
  currentGameStatus: CurrentGameStatus;
  gameState?: GameState;
}

interface ServerStatusWithGame extends BaseServerStatus {
  currentGameStatus: CurrentGameStatus.IN_PROGRESS | CurrentGameStatus.FINISHED;
  gameState: GameState;
}

interface ServerStatusWithoutGame extends BaseServerStatus {
  currentGameStatus: CurrentGameStatus.FULL | CurrentGameStatus.WAITING_ON_OPPONENT;
}

export type ServerStatus = ServerStatusWithGame | ServerStatusWithoutGame;

export const defaultServerStatus: ServerStatus = {
  currentGameStatus: CurrentGameStatus.WAITING_ON_OPPONENT,
};
