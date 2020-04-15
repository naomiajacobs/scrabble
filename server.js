const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const { getCurrentGame, startNewGame } = require("./gameLogic");

const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

function emitGameState(game) {
  io.in('game').emit("game state", game.getGameState());
}

const players = {};

io.on("connection", function (socket) {
  console.log("a user connected");
  console.log(Object.keys(players));

  socket.on("disconnect", function () {
    console.log("user disconnected");
    delete players[socket.id];
  });

  if (Object.keys(players).length === 2) {
    console.log('too late');
    socket.emit('game state', 'too late');
  } else {
    console.log('still room for more');
    players[socket.id] = socket;
    socket.join('game');
    socket.on("initialize", function () {
      let currentGame = getCurrentGame();
      if (!currentGame) {
        currentGame = startNewGame();
      }
      emitGameState(currentGame);
    });
  }
});

http.listen(port, function () {
  console.log(`listening on ${port}`);
});
