const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3001;

let gameState = null;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('initialize', function(msg){
    io.emit('game state', gameState);
  });
});


http.listen(port, function(){
  console.log(`listening on ${port}`);
});