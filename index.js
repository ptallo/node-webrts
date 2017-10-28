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
    addGameRooms(socket);
    socket.on('add lobby', function(){
        let game = new GameRoom("test");
        game_rooms.push(game);
        socket.emit('add room', JSON.stringify(game));
    });
    socket.on('refresh', function(){
        addGameRooms(socket);
    })
});

http.listen(port, function(){
    console.log('listening on *: ' + port);
});

function addGameRooms(socket){
    for(let i = 0; i < game_rooms.length; i++){
        socket.emit('add room', JSON.stringify(game_rooms[i]));
    }
}
