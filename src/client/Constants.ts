export enum SpecialSquare {
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
export const RACK_LOCATION = "RACK_LOCATION";
export enum PlayerName {
  MERT = "Mert",
  NAOMI = "Naomi",
}
export enum MoveType {
  PLAY = "PLAY",
  DUMP = "DUMP",
  SKIP = "SKIP",
}
// TODO deal with nulls for the end of the game
export type Rack = [
  Letter | null,
  Letter | null,
  Letter | null,
  Letter | null,
  Letter | null,
  Letter | null,
  Letter | null
];
interface Player {
  name: PlayerName;
  rack: Rack;
}
export type Location = [number, number];
type PlacedBlank = [Letter, Location, Letter];
type PlacedNonBlank = [Letter, Location, null];
export type PlacedLetter = PlacedBlank | PlacedNonBlank;
interface BaseMove {
  playerName: PlayerName;
  type: MoveType;
}
export interface DumpMove extends BaseMove {
  lettersToDump: Array<RackIndex>;
}
export enum ChallengeStatus {
  'UNRESOLVED_UNCHALLENGED' = 'UNRESOLVED_UNCHALLENGED',
  'RESOLVED_ACCEPTED' = 'RESOLVED_ACCEPTED',
  'UNRESOLVED_CHALLENGED' = 'UNRESOLVED_CHALLENGED',
  'RESOLVED_INVALID' = 'RESOLVED_INVALID',
  'RESOLVED_VALID' = 'RESOLVED_VALID',
}
export interface PlayMove extends BaseMove {
  lettersPlaced: Array<PlacedLetter>;
  challengeStatus: ChallengeStatus;
}
interface SkipMove extends BaseMove {}
export type Move = PlayMove | DumpMove | SkipMove;

export interface PreviouslyPlayedTile {
  letter: Letter;
  fromRack: false;
  fromLastMove: boolean;
}
export type RackIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface TileFromRack {
  letter: Letter;
  fromRack: true;
  rackIndex: RackIndex;
}

export type Board = Array<Array<PreviouslyPlayedTile | TileFromRack | null>>;

export interface GameState {
  player: Player;
  letterBag: Array<Letter>;
  moves: Array<Move>;
  activePlayer: PlayerName;
}

export interface FinishedGameState extends GameState {
  opponentRack: Rack;
}

export enum CurrentGameStatus {
  INTRUDER = "INTRUDER",
  IN_PROGRESS = "IN_PROGRESS",
  GAME_OVER = "GAME_OVER",
}

interface BaseServerStatus {
  currentGameStatus: CurrentGameStatus;
  gameState?: GameState;
}

interface InProgressGame extends BaseServerStatus {
  currentGameStatus: CurrentGameStatus.IN_PROGRESS;
  gameState: GameState;
}

interface FinishedGame extends BaseServerStatus {
  currentGameStatus: CurrentGameStatus.GAME_OVER;
  gameState: FinishedGameState;
}

type ServerStatusWithGame = InProgressGame | FinishedGame;

interface ServerStatusWithoutGame extends BaseServerStatus {
  currentGameStatus: CurrentGameStatus.INTRUDER;
}

export type ServerStatus = ServerStatusWithGame | ServerStatusWithoutGame;

export const defaultServerStatus: ServerStatus = {
  currentGameStatus: CurrentGameStatus.INTRUDER,
};

export enum ActionState {
  GO = "GO",
  WAITING_FOR_CHALLENGE_OR_DRAW = "WAITING_FOR_CHALLENGE_OR_DRAW",
  WAITING_FOR_OPPONENT_MOVE = "WAITING_FOR_OPPONENT_MOVE",
  CHALLENGE_OR_DRAW = "CHALLENGE_OR_DRAW",
  AWAITING_CHALLENGE_RESOLUTION = "AWAITING_CHALLENGE_RESOLUTION",
}
