const SocketIO = require("socket.io");

const {
  MERT,
  NAOMI,
  SERVER_STATUS,
  INITIALIZE,
  IN_PROGRESS,
  MAKE_MOVE,
  CHALLENGE,
  GAME_ERROR,
  GAME_OVER,
  PROMPT_ABANDON,
  GET_ABANDON_CONFIRMATION,
  CONFIRM_ABANDON,
  ABANDON_NOTIFICATION,
  REJECT_ABANDON,
} = require("./constants");
const { abandonGame, getCurrentGame, startNewGame } = require("./gameLogic");

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
  emitToPlayers(SERVER_STATUS, (playerName) => ({
    currentGameStatus:
      game.gameState.status === IN_PROGRESS ? IN_PROGRESS : GAME_OVER,
    gameState: game.getGameState(playerName),
  }));
}

function onConnection(socket) {
  console.log("a user connected");

  // Register listeners
  socket.on(INITIALIZE, (name) => {
    onInitialize(socket, name);
  });

  socket.on(MAKE_MOVE, (move) => {
    onMakeMove(socket, move);
  });

  socket.on(CHALLENGE, () => {
    onChallenge(socket);
  });

  socket.on(PROMPT_ABANDON, (name) => {
    onPromptAbandon(socket, name);
  });

  socket.on(CONFIRM_ABANDON, (name) => {
    onConfirmAbandon(socket, name);
  });

  socket.on(REJECT_ABANDON, (name) => {
    onRejectAbandon(socket, name);
  });
}

function onInitialize(socket, name) {
  if (name !== NAOMI && name !== MERT) {
    console.log("An intruder: ", name);
    socket.emit(SERVER_STATUS, { currentGameStatus: "full" });
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
    io.in(move.playerName).emit(GAME_ERROR, errorMessages);
  }
  emitGameState(getCurrentGame());
}

function onChallenge(socket) {}

function onPromptAbandon(socket, name) {
  console.log(`${name} wants to abandon the game`);
  emitToPlayers(GET_ABANDON_CONFIRMATION, (playerName) => ({
    selfPrompted: name === playerName,
  }));
}

function onConfirmAbandon(socket, name) {
  console.log(`${name} confirmed abandon`);
  const game = getCurrentGame();
  game.confirmAbandon(name);
  if (game.shouldAbandonGame()) {
    abandonGame();
    emitToPlayers(ABANDON_NOTIFICATION);
    const newGame = getCurrentGame();
    emitGameState(newGame);
  }
}

function onRejectAbandon(socket, name) {
  getCurrentGame().cancelAbandon();
}

module.exports = {
  onConnection,
  getIo,
};
