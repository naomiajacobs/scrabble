const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const {getCurrentGame, startNewGame} = require('./gameLogic');

const port = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

function emitGameState(game) {
  io.emit('game state', game.getGameState());
}

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('initialize', function(){
    let currentGame = getCurrentGame();
    if (!currentGame) {
      currentGame = startNewGame();
    }
    emitGameState(currentGame);
  });
});


http.listen(port, function(){
  console.log(`listening on ${port}`);
});