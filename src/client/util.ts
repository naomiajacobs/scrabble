import { Board, Move, MoveType } from "./Constants";

function makeEmptyBoard() {
  const board = [];
  for (const _ of Array(15).keys()) {
    board.push(Array(15).fill(null));
  }
  return board;
}

export function getDeriveBoardFromMoves(moves: Array<Move>): Board {
  const board = makeEmptyBoard();
  moves.forEach((move) => {
    if (move.type === MoveType.PLAY) {
      for (const [letter, [row, col], _] of move.lettersPlaced) {
        board[row][col] = letter;
      }
    }
  });
  return board;
}
