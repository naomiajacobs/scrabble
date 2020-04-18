const {
  EMPTY_BOARD,
  LETTER,
  LETTER_FREQUENCIES,
  MERT,
  NAOMI,
  PLAY,
} = require("./constants");

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
 *   lettersPlaced: Array<[Letter, [y,x], blankSpecifier]>
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
    const firstActivePlayer = Math.floor(Math.random() * 2) ? NAOMI : MERT;
    this.gameState = {
      players: [new Player(NAOMI), new Player(MERT)],
      letterBag: this._randomizeTiles(),
      moves: [
        // todo remove, just seeding for nwo
        {
          playerName: firstActivePlayer,
          type: PLAY,
          lettersPlaced: [
            [LETTER.F, [7, 7], null],
            [LETTER.I, [7, 8], null],
            [LETTER.R, [7, 9], null],
            [LETTER.S, [7, 10], null],
            [LETTER.T, [7, 11], null],
          ],
        },
      ],
      activePlayer: firstActivePlayer,
    };
    console.log(
      `Starting new game, first player is ${this.gameState.firstActivePlayer}`
    );
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
      activePlayer: this.gameState.activePlayer,
    };
  }
}

let currentGame = null;

function getCurrentGame() {
  return currentGame;
}

function startNewGame() {
  console.log('Starting a new game');
  currentGame = new ScrabbleGame();
  return currentGame;
}

function endCurrentGame() {
  console.log("Ending current game");
  currentGame = null;
}

module.exports = {
  getCurrentGame,
  startNewGame,
  endCurrentGame,
};
