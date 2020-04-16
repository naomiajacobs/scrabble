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
  io.in("game").emit("server status", {
    currentGameStatus: 'in progress',
    gameState: game.getGameState(),
  });
}

// Wipe names upon finishing game
let player1Name;
let player2Name;

const knownSockets = {};

io.on("connection", function (socket) {
  console.log("a user connected");
  knownSockets[socket.id] = socket;

  socket.on("disconnect", function () {
    console.log("user disconnected");
    delete knownSockets[socket.id];
  });

  socket.on("initialize", (name) => {
    const currentGame = getCurrentGame() || startNewGame();
    if (player1Name === name || player2Name === name) {
      // Another connection to existing game
      socket.join("game");
      emitGameState(currentGame);
    } else {
      if (!player1Name) {
        player1Name = name;
        socket.join("game");
        socket.emit("server status", { currentGameStatus: "waiting on opponent" });
      } else if (!player2Name) {
        player2Name = name;
        socket.join("game");
        emitGameState(currentGame);
      } else {
        // Game full
        console.log("full");
        socket.emit("server status", { currentGameStatus: "full" });
      }
    }
  });

  // if (Object.keys(players).length === 2) {
  //   console.log('too late');
  //   socket.emit('server status', 'full');
  // } else {
  //   console.log('still room for more');
  //   players[socket.id] = socket;
  //   socket.join('game');
  //   socket.on("initialize", function (name) {
  //     console.log('name: ', name);
  //     let currentGame = getCurrentGame();
  //     if (!currentGame) {
  //       currentGame = startNewGame();
  //     }
  //     emitGameState(currentGame);
  //   });
  // }
});

http.listen(port, function () {
  console.log(`listening on ${port}`);
});
