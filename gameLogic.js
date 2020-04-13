const shuffle = require('shuffle-array');
/*
* players:
*   name: string
*   rack: array of 7 letters
*   score: derived from moves
* currentTurn: 0 or 1
* board state: 15x15 array (derived from moves)
* remaining tiles: array of letters
* moves:
*   playerId: string
*   type: 'play' or 'dump' or 'pass'
*   data:
*     starting square: [x, y]
*     direction: 'right' or 'down'
*     word: string
*     blankSpecifiers: array of at most 2 letters
*     validScrabbleWord: boolean
* */

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
  BLANK: 2
};

class Player {
  constructor() {
    this.rack = [];
  }
  drawTiles(letterBag) {
    while (this.rack.length < 7) {
      this.rack.push(letterBag.pop());
    }
  }
  setName(name) {
    this.name = name;
  }
  name() {
    return this.name;
  }
}


class ScrabbleGame {
  constructor() {
    this.gameState = {
      players: [new Player(), new Player()],
      letterBag: this._randomizeTiles(),
      moves: [],
      currentTurn: Math.floor(Math.random() * 2),
    };
    this.gameState.players.forEach((player) => {
      player.drawTiles(this.gameState.letterBag);
    });
  }

  _randomizeTiles() {
    const letters = [];
    for (const letter of Object.keys(LETTER_FREQUENCIES)) {
      letters.push(...Array(LETTER_FREQUENCIES[letter]).fill(letter));
    }
    return shuffle(letters);
  }

  getGameState() {
    return this.gameState;
  }
}

let currentGame = null;

function getCurrentGame() {
  return currentGame;
}

function startNewGame() {
  currentGame = new ScrabbleGame();
  return currentGame;
}

module.exports = {
  getCurrentGame,
  startNewGame,
};