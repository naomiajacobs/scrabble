const {LETTER_FREQUENCIES, MERT, NAOMI} = require('./constants');

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
      // todo remove letterbag from client?
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
