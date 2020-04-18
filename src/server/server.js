const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const { endCurrentGame, getCurrentGame, startNewGame } = require("./gameLogic");
const { MERT, NAOMI } = require("./constants");

const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

let naomiHere = false;
let mertHere = false;

function emitGameState(game) {
  io.in(NAOMI).emit("server status", {
    currentGameStatus: "in progress",
    gameState: game.getGameState(NAOMI),
  });
  io.in(MERT).emit("server status", {
    currentGameStatus: "in progress",
    gameState: game.getGameState(MERT),
  });
}

io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("disconnect", function () {
    console.log("user disconnected");
    io.in(NAOMI).clients((_, clients) => {
      if (clients.length === 0) {
        naomiHere = false;
        endCurrentGame();
      }
    });
    io.in(MERT).clients((_, clients) => {
      if (clients.length === 0) {
        mertHere = false;
        endCurrentGame();
      }
    });
  });

  socket.on("initialize", (name) => {
    if (name !== NAOMI && name !== MERT) {
      console.log("an intruder!");
      socket.emit("server status", { currentGameStatus: "full" });
      return;
    }
    if (name === NAOMI) {
      console.log("Naomi joined");
      naomiHere = true;
      socket.join(NAOMI);
    } else {
      console.log("Mert joined");
      mertHere = true;
      socket.join(MERT);
    }

    if (!getCurrentGame()) {
      if (naomiHere && mertHere) {
        console.log("Everyone is here!");
        emitGameState(startNewGame());
      } else {
        console.log("Waiting for opponent");
        socket.emit("server status", {
          currentGameStatus: "waiting on opponent",
        });
      }
    }
  });
});

http.listen(port, function () {
  console.log(`listening on ${port}`);
});
