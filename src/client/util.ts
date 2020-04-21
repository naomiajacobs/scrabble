import {
  Board,
  GameState,
  Move,
  MoveType,
  PlayerName,
  PlayMove,
  Rack,
} from "./Constants";
import { PlacedLettersState } from "./state/usePlacedLetters";

function makeEmptyBoard() {
  const board = [];
  for (const _ of Array(15).keys()) {
    board.push(Array(15).fill(null));
  }
  return board;
}

export function getDerivedBoard(
  moves: Array<Move>,
  placedLetters: PlacedLettersState,
  rack: Rack
): Board {
  const board = makeEmptyBoard();

  moves.forEach((move) => {
    if (move.type === MoveType.PLAY) {
      for (const [letter, [row, col], _] of (move as PlayMove).lettersPlaced) {
        board[row][col] = { letter, fromRack: false };
      }
    }
  });

  placedLetters.forEach((location, i) => {
    if (location) {
      const [row, col] = location;
      board[row][col] = { letter: rack[i], fromRack: true, rackIndex: i };
    }
  });
  return board;
}

export function partitionMoves(
  gameState: GameState
): { [key in PlayerName]: Array<Move> } {
  const naomiMoves = gameState.moves.filter(
    (m) => m.playerName === PlayerName.NAOMI
  );
  const mertMoves = gameState.moves.filter(
    (m) => m.playerName === PlayerName.MERT
  );
  return { [PlayerName.NAOMI]: naomiMoves, [PlayerName.MERT]: mertMoves };
}

export function calculateScoreForMove(
  gameState: GameState,
  playerMoveIndex: number
): number {
  const move = gameState.moves[playerMoveIndex];
  const playerName = move.playerName;
  const playerMoves = partitionMoves(gameState)[playerName];

  return 10;
}

export function calculateScore(
  gameState: GameState,
  player: PlayerName
): number {
  return 100;
}
