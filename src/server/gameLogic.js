const shuffle = require("shuffle-array");
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
  BLANK: 2,
};

class Player {
  constructor(name) {
    this.rack = [];
    this.name = name;
  }
  drawTiles(letterBag) {
    console.log("Drawing tiles");
    while (this.rack.length < 7) {
      this.rack.push(letterBag.pop());
    }
    console.log(`Letters left in bag: ${letterBag.length}`);
  }
}

const NAOMI = "Naomi";
const MERT = "Mert";

class ScrabbleGame {
  constructor() {
    console.log(`Starting new game`);
    this.gameState = {
      players: [new Player(NAOMI), new Player(MERT)],
      letterBag: this._randomizeTiles(),
      moves: [],
      currentTurn: Math.floor(Math.random() * 2) ? NAOMI : MERT,
    };
    console.log("Drawing initial tiles");
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

  getGameState(playerName) {
    return {
      player: this.gameState.players.find((p) => p.name === playerName),
      letterBag: this.gameState.letterBag,
      moves: this.gameState.moves,
      currentTurn: this.gameState.currentTurn,
    };
  }
}

let currentGame = null;

function getCurrentGame() {
  return currentGame;
}

function startNewGame() {
  'Starting a new game';
  currentGame = new ScrabbleGame();
  return currentGame;
}

function endCurrentGame() {
  console.log('Ending current game');
  currentGame = null;
}

module.exports = {
  getCurrentGame,
  startNewGame,
  endCurrentGame,
  NAOMI,
  MERT,
};
