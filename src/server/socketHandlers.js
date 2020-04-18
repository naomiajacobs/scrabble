const SocketIO = require("socket.io");

const { MERT, NAOMI } = require("./constants");
const { getCurrentGame, startNewGame } = require("./gameLogic");

let io;

const getIo = function (http) {
  io = io || SocketIO(http);
  return io;
};

const SERVER_STATUS = 'server status';
const IN_PROGRESS = 'in progress';
const INITIALIZE = 'initialize';
const MAKE_MOVE = 'make move';

function emitGameState(game) {
  io.in(NAOMI).emit(SERVER_STATUS, {
    currentGameStatus: IN_PROGRESS,
    gameState: game.getGameState(NAOMI),
  });
  io.in(MERT).emit(SERVER_STATUS, {
    currentGameStatus: IN_PROGRESS,
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
  })
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
  getCurrentGame().makeMove(move);
  emitGameState(getCurrentGame());
}

module.exports = {
  onConnection,
  getIo,
};
