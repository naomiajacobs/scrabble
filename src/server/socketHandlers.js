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
} = require("./constants");
const { getCurrentGame, startNewGame } = require("./gameLogic");

let io;

const getIo = function (http) {
  io = io || SocketIO(http);
  return io;
};

function emitGameState(game) {
  io.in(NAOMI).emit(SERVER_STATUS, {
    currentGameStatus:
      game.gameState.status === IN_PROGRESS ? IN_PROGRESS : GAME_OVER,
    gameState: game.getGameState(NAOMI),
  });
  io.in(MERT).emit(SERVER_STATUS, {
    currentGameStatus:
      game.gameState.status === IN_PROGRESS ? IN_PROGRESS : GAME_OVER,
    gameState: game.getGameState(MERT),
  });
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

module.exports = {
  onConnection,
  getIo,
};
