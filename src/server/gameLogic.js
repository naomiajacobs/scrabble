const {
  LETTER_FREQUENCIES,
  MERT,
  NAOMI,
  DUMP,
  PLAY,
  GAME_OVER,
  IN_PROGRESS,
  ChallengeStatus,
  ChallengeResolution,
} = require("./constants");
const MoveValidator = require("./moveValidator");
const { getOtherPlayer } = require("./util");

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

const initialAbandonConfirmations = { [NAOMI]: false, [MERT]: false };

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
    this.abandonConfirmations = { ...initialAbandonConfirmations };
    console.log(
      `Starting new game, first player is ${this.gameState.activePlayer}`
    );
    console.log("Drawing initial tiles");
    for (const player of Object.values(this.gameState.players)) {
      player.drawTiles(this.gameState.letterBag);
    }
  }

  confirmAbandon(playerName) {
    this.abandonConfirmations[playerName] = true;
  }

  shouldAbandonGame() {
    return this.abandonConfirmations[NAOMI] && this.abandonConfirmations[MERT];
  }

  cancelAbandon() {
    this.abandonConfirmations = { ...initialAbandonConfirmations };
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

  checkForGameEnd(move) {
    const player = this.gameState.players[move.playerName];
    if (this.gameState.letterBag.length === 0 && player.rack.length === 0) {
      this.gameState.status = GAME_OVER;
      console.log("Game is over!", JSON.stringify(currentGame));
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

  doDumpMove(move) {
    // TODO validate you're not dumping more letters than there are in the bag
    console.group("Dumping tiles");
    this.gameState.moves.push(move);
    const player = this.getMovePlayer(move);
    const rack = player.rack;
    console.log("Current rack: ", rack);
    console.log("Indices of letters to dump: ", move.lettersToDump);
    // Put the letters back in the bag
    move.lettersToDump.forEach((letterIndex) => {
      this.gameState.letterBag.push(player.rack[letterIndex]);
    });
    // Reshuffle the bag so there's an equal chance of getting them again
    shuffle(this.gameState.letterBag);

    // Remove letters from rack
    player.rack = rack.filter(
      (letter, index) => !move.lettersToDump.includes(index)
    );
    console.log("Rack after dumping: ", player.rack);
    console.groupEnd();
    this._endMove();
  }

  makeMove(move) {
    const isFirstPlayMove =
      this.gameState.moves.filter(
        (m) =>
          m.type === PLAY &&
          m.challengeStatus !== ChallengeStatus.RESOLVED_INVALID
      ).length === 0;
    const validator = new MoveValidator(this.gameState, move, isFirstPlayMove);
    if (validator.moveIsValid()) {
      if (move.type === DUMP) {
        this.doDumpMove(move);
      } else {
        this.doPlayMove(move);
      }
    } else {
      return validator.messages;
    }
  }

  acceptMove() {
    const move = this.getLastMove();
    move.challengeStatus = ChallengeStatus.RESOLVED_ACCEPTED;
    this._endMove();
  }

  challengeMove() {
    const move = this.getLastMove();
    move.challengeStatus = ChallengeStatus.UNRESOLVED_CHALLENGED;
  }

  resolveChallenge(challengeStatus) {
    // TODO error if it wasn't challenged before

    const move = this.getLastMove();
    move.challengeStatus = challengeStatus;
    if (challengeStatus === ChallengeStatus.RESOLVED_INVALID) {
      console.log("Challenge successful!");
      this.gameState.players[move.playerName].rack.push(
        ...move.lettersPlaced.map((pl) => pl[0])
      );
      this._endMove();
    } else {
      console.log("Challenge failed!");
      this._endMove();
      this.gameState.moves.push({
        playerName: getOtherPlayer(move.playerName),
        type: "SKIP",
      });
      this._endMove();
    }
  }

  _endMove() {
    const move = this.getLastMove();
    this.refillRack(move);
    this.checkForGameEnd(move);
    this.toggleActivePlayer();
  }

  getLastMove() {
    const moves = this.gameState.moves;
    return moves.length
      ? this.gameState.moves[this.gameState.moves.length - 1]
      : undefined;
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

function abandonGame() {
  if (currentGame.shouldAbandonGame()) {
    console.log("Abandoning game");
    console.log("Abandoned game state: ", JSON.stringify(currentGame));
    currentGame = startNewGame();
  } else {
    throw new Error(
      "Tried to abandon game without confirmation from both players"
    );
  }
}

module.exports = {
  getCurrentGame,
  startNewGame,
  abandonGame,
};
