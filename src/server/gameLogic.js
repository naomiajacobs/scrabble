const {
  LETTER_FREQUENCIES,
  MERT,
  NAOMI,
  DUMP,
  GAME_OVER,
  IN_PROGRESS,
} = require("./constants");
const MoveValidator = require("./moveValidator");

const shuffle = require("shuffle-array");

class Player {
  constructor(name) {
    this.rack = [];
    this.name = name;
  }
  drawTiles(letterBag) {
    console.log("Drawing tiles");
    while (this.rack.length < 7 && letterBag.length > 0) {
      this.rack.push(letterBag.pop());
    }
    console.log(`Letters left in bag: ${letterBag.length}`);
  }
}

class ScrabbleGame {
  constructor() {
    const firstActivePlayer = Math.floor(Math.random() * 2) ? NAOMI : MERT;
    this.gameState = {
      players: { [NAOMI]: new Player(NAOMI), [MERT]: new Player(MERT) },
      letterBag: this._randomizeTiles(),
      moves: [],
      activePlayer: firstActivePlayer,
      status: IN_PROGRESS,
    };
    console.log(
      `Starting new game, first player is ${this.gameState.activePlayer}`
    );
    console.log("Drawing initial tiles");
    for (const player of Object.values(this.gameState.players)) {
      player.drawTiles(this.gameState.letterBag);
    }
  }

  toggleActivePlayer() {
    this.gameState.activePlayer =
      this.gameState.activePlayer === MERT ? NAOMI : MERT;
  }

  _randomizeTiles() {
    const letters = [];
    for (const letter of Object.keys(LETTER_FREQUENCIES)) {
      letters.push(...Array(LETTER_FREQUENCIES[letter]).fill(letter));
    }
    return shuffle(letters);
  }

  getGameState(playerName) {
    const opponent = playerName === NAOMI ? MERT : NAOMI;
    return {
      player: this.gameState.players[playerName],
      // todo remove letterbag from client?
      letterBag: this.gameState.letterBag,
      moves: this.gameState.moves,
      activePlayer: this.gameState.activePlayer,
      status: this.gameState.status,
      opponentRack:
        this.gameState.status === GAME_OVER
          ? this.gameState.players[opponent].rack
          : null,
    };
  }

  doDumpMove(move) {}

  checkForGameEnd(move) {
    const player = this.gameState.players[move.playerName];
    if (this.gameState.letterBag.length === 0 && player.rack.length === 0) {
      this.gameState.status = GAME_OVER;
    }
  }

  getMovePlayer(move) {
    return this.gameState.players[move.playerName];
  }

  refillRack(move) {
    this.getMovePlayer(move).drawTiles(this.gameState.letterBag);
  }

  doPlayMove(move) {
    this.gameState.moves.push(move);
    const player = this.getMovePlayer(move);
    const rack = player.rack;
    for (const [letter, _, __] of move.lettersPlaced) {
      const index = rack.indexOf(letter);
      // remove letter
      rack.splice(index, 1);
    }
  }

  makeMove(move) {
    const isFirstMove = this.gameState.moves.length === 0;
    const validator = new MoveValidator(this.gameState, move, isFirstMove);
    if (validator.moveIsValid()) {
      this.doPlayMove(move);

      if (move.type === DUMP) {
        this.doDumpMove(move);
      }

      this.refillRack(move);

      this.checkForGameEnd(move);
      this.toggleActivePlayer();
    } else {
      return validator.messages;
    }
  }
}

let currentGame = null;

function getCurrentGame() {
  return currentGame;
}

function startNewGame() {
  console.log("Starting a new game");
  currentGame = new ScrabbleGame();
  return currentGame;
}

module.exports = {
  getCurrentGame,
  startNewGame,
};
