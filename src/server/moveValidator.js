const { LETTER, DUMP, PASS } = require("./constants");
const { getDerivedBoard } = require("./util");

function getAllRows(move) {
  return move.lettersPlaced.map((letter) => letter[1]).map(([row, _]) => row);
}

function getAllCols(move) {
  return move.lettersPlaced.map((letter) => letter[1]).map(([_, col]) => col);
}

function getUniqueRows(move) {
  return new Set(getAllRows(move));
}

function getUniqueCols(move) {
  return new Set(getAllCols(move));
}

function getLetterPlacedAtPosition(move, row, col) {
  return move.lettersPlaced.find((l) => {
    const [lRow, lCol] = l[1];
    return lRow === row && lCol === col;
  });
}

function isValidLocation([row, col]) {
  return 0 <= row && row <= 14 && 0 <= col && col <= 14;
}

function getTouchingSquares([row, col]) {
  return [
    [row + 1, col],
    [row - 1, col],
    [row, col + 1],
    [row, col - 1],
  ].filter((location) => isValidLocation(location));
}

function letterTouchesExistingLetter(move, board) {
  let foundTouchingLetter = false;
  for (const letter of move.lettersPlaced) {
    for (const [row, col] of getTouchingSquares(letter[1])) {
      if (board[row][col]) {
        foundTouchingLetter = true;
      }
    }
  }
  return foundTouchingLetter;
}

const letterValidations = {
  validCharacter: {
    test: ([letter, [row, col], blankSpecifier]) => Boolean(LETTER[letter]),
    message: "Invalid letter character",
  },
  validBlankSpecification: {
    test: ([letter, [row, col], blankSpecifier]) =>
      letter === LETTER.BLANK ? Boolean(LETTER[blankSpecifier]) : true,
    message: "Invalid blank specification",
  },
  validLocation: {
    test: ([letter, location, blankSpecifier]) => isValidLocation(location),
    message: "Invalid location, off the board",
  },
  locationEmpty: {
    test: ([letter, [row, col], blankSpecifier], derivedBoard) =>
      !Boolean(derivedBoard[row][col]),
    message: "Square already taken by a previous letter",
  },
};

const wordValidations = {
  atLeastOneLetter: {
    test: (move) => move.lettersPlaced.length > 0,
    message: "Move must include placing at least one letter",
  },
  lettersOnOneAxis: {
    test: (move) => {
      const rows = getUniqueRows(move);
      const cols = getUniqueCols(move);
      return rows.size === 1 || cols.size === 1;
    },
    message: "Letters can only go in one direction",
  },
  firstMoveUsesCenter: {
    test: (move, board, isFirstMove) => {
      if (!isFirstMove) {
        return true;
      }
      return move.lettersPlaced.some((l) => {
        const position = l[1];
        return position[0] === 7 && position[1] === 7;
      });
    },
    message: "First move must use the center square",
  },
  connectsToExistingWord: {
    test: (move, board, isFirstMove) => {
      if (isFirstMove) {
        return true;
      }
      return letterTouchesExistingLetter(move, board);
    },
    message: "Word must touch existing words on the board",
  },
  lettersFormContinuousWord: {
    message: "Letters must form a continuous word",
    test: (move, board) => {
      if (move.lettersPlaced === 1) {
        return true;
      }
      const rows = getUniqueRows(move);
      if (rows.size > 1) {
        // vertical
        const col = getAllCols(move)[0];
        const firstRow = Math.min(...move.lettersPlaced.map((l) => l[1][0]));
        const lastRow = Math.max(...move.lettersPlaced.map((l) => l[1][0]));

        let foundEmptySquare = false;
        for (const i of Object.keys(Array(lastRow - firstRow))) {
          if (
            !getLetterPlacedAtPosition(move, firstRow + i, col) &&
            !board[firstRow + i][col]
          ) {
            foundEmptySquare = true;
          }
        }
        return !foundEmptySquare;
      } else {
        // horizontal
        const row = getAllRows(move)[0];
        const firstCol = Math.min(...move.lettersPlaced.map((l) => l[1][1]));
        const lastCol = Math.max(...move.lettersPlaced.map((l) => l[1][1]));

        let foundEmptySquare = false;
        for (const i of Object.keys(Array(lastCol - firstCol))) {
          console.log(i);
          if (
            !getLetterPlacedAtPosition(move, row, firstCol + i) &&
            !board[row][firstCol + i]
          ) {
            foundEmptySquare = true;
          }
        }
        return !foundEmptySquare;
      }
    },
  },
};

class MoveValidator {
  constructor(gameState, newMove, isFirstMove) {
    this.gameState = gameState;
    this.move = newMove;
    this.derivedBoard = getDerivedBoard(gameState.moves);
    this.isFirstMove = isFirstMove;
  }

  logInvalidMove(message) {
    console.log(`Validation error: ${message}`);
  }

  moveIsForCorrectPlayer() {
    return this.move.playerName === this.gameState.activePlayer;
  }

  lettersAreValid() {
    return this.move.lettersPlaced.every((l) => {
      let valid = true;
      for (const [k, validator] of Object.entries(letterValidations)) {
        if (!validator.test(l, this.derivedBoard)) {
          this.logInvalidMove(`${validator.message}: ${JSON.stringify(l)}`);
          valid = false;
        }
      }
      return valid;
    });
  }

  wordsAreValid() {
    // DOESN'T validate that words are in the dictionary
    let valid = true;
    for (const [k, validator] of Object.entries(wordValidations)) {
      if (!validator.test(this.move, this.derivedBoard, this.isFirstMove)) {
        this.logInvalidMove(
          `${validator.message}: ${JSON.stringify(this.move)}`
        );
        valid = false;
      }
    }
    return valid;
  }

  moveIsValid() {
    if (!this.moveIsForCorrectPlayer()) {
      this.logInvalidMove("Incorrect player tried to move");
      return false;
    }

    if (this.move.type === PASS || this.move.type === DUMP) {
      // TODO validate # of letters dumped isn't more than are left in the bag
      return true;
    }

    return this.lettersAreValid() && this.wordsAreValid();
  }
}

module.exports = MoveValidator;
