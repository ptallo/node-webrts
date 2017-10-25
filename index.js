var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var {GameRoom} = require("./GameRoom.js");
var port = 8080;
var game_rooms = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  app.use(express.static(__dirname + '/public'));
});

io.on('connection', function(socket){
  socket.on('add lobby', function(){
    io.emit('add lobby');
    var game = new GameRoom();
    game_rooms.push(game);
  });
});

http.listen(port, function(){
  console.log('listening on *: ' + port);
});
