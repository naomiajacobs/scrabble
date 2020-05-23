const SocketIO = require("socket.io");

const {
  MERT,
  NAOMI,
  IN_PROGRESS,
  GAME_OVER,
  INTRUDER,
  GameEvent,
} = require("./constants");
const {
  abandonGame,
  getCurrentGame,
  startNewGame,
  resumeGameFromJSON,
} = require("./gameLogic");

let io;

const getIo = function (http) {
  io = io || SocketIO(http);
  return io;
};

function emitToPlayers(message, createData) {
  console.log(`Emitting ${message} to ${NAOMI}`);
  io.in(NAOMI).emit(message, createData && createData(NAOMI));
  console.log(`Emitting ${message} to ${MERT}`);
  io.in(MERT).emit(message, createData && createData(MERT));
}

function emitGameState(game) {
  emitToPlayers(GameEvent.SERVER_STATUS, (playerName) => ({
    currentGameStatus:
      game.gameState.status === IN_PROGRESS ? IN_PROGRESS : GAME_OVER,
    gameState: game.getGameState(playerName),
  }));
  game.save();
}

function onConnection(socket) {
  console.log("a user connected");

  // Register listeners
  socket.on(GameEvent.INITIALIZE, (name) => {
    onInitialize(socket, name);
  });

  socket.on(GameEvent.MAKE_MOVE, (move) => {
    onMakeMove(socket, move);
  });

  socket.on(GameEvent.CHALLENGE_MOVE, (name) => {
    onChallenge(socket, name);
  });

  socket.on(GameEvent.CHALLENGE_RESOLVED, (challengeStatus) => {
    onChallengeResolved(challengeStatus);
  });

  socket.on(GameEvent.ACCEPT_MOVE, (name) => {
    onAccept(name);
  });

  socket.on(GameEvent.PROMPT_ABANDON, (name) => {
    onPromptAbandon(socket, name);
  });

  socket.on(GameEvent.CONFIRM_ABANDON, (name) => {
    onConfirmAbandon(socket, name);
  });

  socket.on(GameEvent.REJECT_ABANDON, (name) => {
    onRejectAbandon(socket, name);
  });

  socket.on(GameEvent.RESUME_GAME_FROM_JSON, (json, name) => {
    onResumeGameFromJSON(json, name);
  });
}

function onInitialize(socket, name) {
  if (name !== NAOMI && name !== MERT) {
    console.log("An intruder: ", name);
    socket.emit(GameEvent.SERVER_STATUS, { currentGameStatus: INTRUDER });
    return;
  }
  if (name === NAOMI) {
    console.log("Naomi joined");
    socket.join(NAOMI);
  } else {
    console.log("Mert joined");
    socket.join(MERT);
  }

  emitGameState(getCurrentGame() || startNewGame());
}

function onMakeMove(socket, move) {
  const errorMessages = getCurrentGame().makeMove(move);
  if (errorMessages && errorMessages.length) {
    io.in(move.playerName).emit(GameEvent.GAME_ERROR, errorMessages);
  }
  emitGameState(getCurrentGame());
}

function onAccept(name) {
  console.log(`${name} accepted move, drawing letters for next player`);
  const game = getCurrentGame();
  game.acceptMove();
  emitGameState(game);
}

function onChallenge(socket, name) {
  console.log(`${name} is challenging`);
  const game = getCurrentGame();
  game.challengeMove();
  emitGameState(game);
}

function onPromptAbandon(socket, name) {
  console.log(`${name} wants to abandon the game`);
  emitToPlayers(GameEvent.GET_ABANDON_CONFIRMATION, (playerName) => ({
    selfPrompted: name === playerName,
  }));
}

function onConfirmAbandon(socket, name) {
  console.log(`${name} confirmed abandon`);
  const game = getCurrentGame();
  game.confirmAbandon(name);
  if (game.shouldAbandonGame()) {
    abandonGame();
    emitToPlayers(GameEvent.ABANDON_NOTIFICATION);
    const newGame = getCurrentGame();
    emitGameState(newGame);
  }
}

function onRejectAbandon(socket, name) {
  getCurrentGame().cancelAbandon();
}

function onChallengeResolved(challengeStatus) {
  console.log(`Challenge resolved: ${challengeStatus}`);
  const game = getCurrentGame();
  game.resolveChallenge(challengeStatus);
  emitGameState(game);
}

function onResumeGameFromJSON(json, name) {
  console.log(`${name} resuming game from JSON`);
  const newGame = resumeGameFromJSON(json);
  emitGameState(newGame);
}

module.exports = {
  onConnection,
  getIo,
};
