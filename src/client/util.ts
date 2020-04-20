import { Board, Move, MoveType, Rack } from "./Constants";
import { PlacedLettersState } from "./state/usePlacedLetters";

function makeEmptyBoard() {
  const board = [];
  for (const _ of Array(15).keys()) {
    board.push(Array(15).fill(null));
  }
  return board;
}

export function getDeriveBoard(
  moves: Array<Move>,
  placedLetters: PlacedLettersState,
  rack: Rack
): Board {
  const board = makeEmptyBoard();

  moves.forEach((move) => {
    if (move.type === MoveType.PLAY) {
      for (const [letter, [row, col], _] of move.lettersPlaced) {
        board[row][col] = {letter, fromRack: false};
      }
    }
  });

  placedLetters.forEach((location, i) => {
    if (location) {
      const [row, col] = location;
      board[row][col] = {letter: rack[i], fromRack: true, rackIndex: i};
    }
  });
  return board;
}
