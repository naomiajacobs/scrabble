const {
  LETTER,
  LETTER_FREQUENCIES,
  MERT,
  NAOMI,
  PLAY,
  DUMP,
  PASS
} = require("./constants");

const shuffle = require("shuffle-array");

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
            [LETTER.BLANK, [7, 9], LETTER.R],
            [LETTER.S, [7, 10], null],
            [LETTER.T, [7, 11], null],
          ],
        },
      ],
      activePlayer: firstActivePlayer,
    };
    console.log(
      `Starting new game, first player is ${this.gameState.activePlayer}`
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

  makeMove(move) {
    if (move.type === PASS) {
      this.gameState.moves.push(move);
    } else if (move.type === DUMP) {
      // validate (optional?)
      // dump letters
      // append
    } else {
      // validate move
      // append
    }
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

module.exports = {
  getCurrentGame,
  startNewGame,
};
