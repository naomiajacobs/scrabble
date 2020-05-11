const { ChallengeStatus, MERT, NAOMI, PLAY } = require("./constants");

function makeEmptyBoard() {
  const board = [];
  for (const _ of Array(15).keys()) {
    board.push(Array(15).fill(null));
  }
  return board;
}

function getDerivedBoard(moves) {
  const board = makeEmptyBoard();
  moves.forEach((move) => {
    if (
      move.type === PLAY &&
      move.challengeStatus !== ChallengeStatus.RESOLVED_INVALID
    ) {
      for (const [letter, [row, col], _] of move.lettersPlaced) {
        board[row][col] = letter;
      }
    }
  });
  return board;
}

function getOtherPlayer(name) {
  return name === MERT ? NAOMI : MERT;
}

module.exports = { getDerivedBoard, getOtherPlayer };
