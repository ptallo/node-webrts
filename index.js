//Imports
'use strict';
var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const GameRoom = require("./GameRoom.js");
var port = 8080;

//Variables
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
    console.log("Game room length: " + game_rooms.length);
  });
  socket.on('refresh', function(){
    for(var i = 0; i < game_rooms.length; i++){
      socket.emit('refresh_list', JSON.stringify(game_rooms[i]));
    }
  })
});

http.listen(port, function(){
  console.log('listening on *: ' + port);
});
