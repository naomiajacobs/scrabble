import {
  Board,
  GameState,
  LETTER_VALUES,
  Location,
  Move,
  MoveType,
  PlayerName,
  PlayMove,
  PreviouslyPlayedTile,
  Rack,
  SpecialSquare,
  SQUARES_BY_LOCATION,
} from "./Constants";
import { PlacedLettersState } from "./state/usePlacedLetters";

function makeEmptyBoard() {
  const board = [];
  for (const _ of Array(15).keys()) {
    board.push(Array(15).fill(null));
  }
  return board;
}

function addMoveToBoard(board: Board, move: Move): void {
  if (move.type === MoveType.PLAY) {
    for (const [letter, [row, col], _] of (move as PlayMove).lettersPlaced) {
      board[row][col] = { letter, fromRack: false };
    }
  }
}

export function getDerivedBoard(
  moves: Array<Move>,
  placedLetters: PlacedLettersState,
  rack: Rack
): Board {
  const board = makeEmptyBoard();

  moves.forEach((move) => {
    addMoveToBoard(board, move);
  });

  placedLetters.forEach((location, i) => {
    if (location) {
      const [row, col] = location;
      board[row][col] = { letter: rack[i], fromRack: true, rackIndex: i };
    }
  });
  return board;
}

// "4,5"
function locationToString(location: Location): string {
  return `${location[0]},${location[1]}`;
}

function stringToLocation(str: string): Location {
  return str.split(",").map((s) => parseInt(s, 10)) as Location;
}

// "4,5:4,10"
function getWordString(start: Location, end: Location): string {
  return `${locationToString(start)}:${locationToString(end)}`;
}

function findVerticalWord(board: Board, location: Location): string | null {
  const col = location[1];
  let firstLetter = location;
  let lastLetter = location;
  let row = location[0] - 1;
  while (row >= 0 && board[row][col]) {
    firstLetter = [row, col];
    row--;
  }
  row = location[0] + 1;
  while (row <= 14 && board[row][col]) {
    lastLetter = [row, col];
    row++;
  }

  if (lastLetter[0] - firstLetter[0] === 0) {
    return null;
  }
  return getWordString(firstLetter, lastLetter);
}

function findHorizontalWord(board: Board, location: Location): string | null {
  const row = location[0];
  let firstLetter = location;
  let lastLetter = location;
  let col = location[1] - 1;
  while (col >= 0 && board[row][col]) {
    firstLetter = [row, col];
    col--;
  }
  col = location[1] + 1;
  while (col <= 14 && board[row][col]) {
    lastLetter = [row, col];
    col++;
  }

  if (lastLetter[1] - firstLetter[1] === 0) {
    return null;
  }
  return getWordString(firstLetter, lastLetter);
}

function getLocationsInWord(word: string): Array<Location> {
  const [start, end] = word.split(":").map((str) => stringToLocation(str));
  const horizontal = start[0] === end[0];
  const letters: Array<Location> = [start];
  if (horizontal) {
    let nextCol = start[1] + 1;
    while (nextCol <= 14 && nextCol < end[1]) {
      letters.push([start[0], nextCol]);
      nextCol++;
    }
  } else {
    // vertical word
    let nextRow = start[0] + 1;
    while (nextRow <= 14 && nextRow < end[0]) {
      letters.push([nextRow, start[1]]);
      nextRow++;
    }
  }
  letters.push(end);
  return letters;
}

function calculateScoreForMove(board: Board, move: PlayMove): number {
  const words: Array<string> = [];
  // find all words
  for (const letter of move.lettersPlaced) {
    const verticalWord = findVerticalWord(board, letter[1]);
    if (verticalWord && words.indexOf(verticalWord) === -1) {
      words.push(verticalWord);
    }
    const horizontalWord = findHorizontalWord(board, letter[1]);
    if (horizontalWord && words.indexOf(horizontalWord) === -1) {
      words.push(horizontalWord);
    }
  }

  const newLetterLocations = move.lettersPlaced.map((l) =>
    locationToString(l[1])
  );

  // for each word
  let score = 0;
  words.forEach((word) => {
    const locations = getLocationsInWord(word);
    let wordVal = 0;
    let numDoubleWords = 0;
    let numTripleWords = 0;
    for (const location of locations) {
      const isNewLetter =
        newLetterLocations.indexOf(locationToString(location)) !== -1;
      const { letter } = board[location[0]][
        location[1]
      ] as PreviouslyPlayedTile;
      let letterVal = LETTER_VALUES[letter];
      const specialLetter = SQUARES_BY_LOCATION[locationToString(location)];
      if (isNewLetter && specialLetter) {
        if (specialLetter === SpecialSquare.DOUBLE_LETTER) {
          letterVal *= 2;
        } else if (specialLetter === SpecialSquare.TRIPLE_LETTER) {
          letterVal *= 3;
        } else if (specialLetter === SpecialSquare.DOUBLE_WORD) {
          numDoubleWords += 1;
        } else {
          numTripleWords += 1;
        }
      }
      wordVal += letterVal;
    }
    for (let i = 0; i < numDoubleWords; i++) {
      wordVal *= 2;
    }
    for (let i = 0; i < numTripleWords; i++) {
      wordVal *= 3;
    }
    score += wordVal;
  });
  if (move.lettersPlaced.length === 7) {
    score += 50;
  }

  return score;
}

export function calculateScore(gameState: GameState): Array<number> {
  const board = makeEmptyBoard();

  const scores = gameState.moves.map((move) => {
    if (move.type === MoveType.DUMP) {
      return 0;
    }
    addMoveToBoard(board, move);
    return calculateScoreForMove(board, move as PlayMove);
  });
  return scores;
}

export class GameScore {
  gameState: GameState;
  moveScores: Array<number>;
  constructor(gameState: GameState) {
    this.gameState = gameState;
    this.moveScores = calculateScore(gameState);
  }

  scoreForPlayer(playerName: PlayerName): number {
    const score = this.gameState.moves.reduce((sum, move, i) => {
      if (move.playerName === playerName) {
        sum += this.scoreForMove(i);
      }
      return sum;
    }, 0);
    return score;
  }

  scoreForMove(moveIndex: number): number {
    return this.moveScores[moveIndex];
  }
}
