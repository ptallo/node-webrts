//Imports
'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var GameRoom = require("./GameRoom.js");
var port = 8080;

//Configuration
app.use(express.static(__dirname + '/public'));

//Variables
var game_rooms = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
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
    });
    
    socket.on('join_room', function (gameRoomJSON) {
        console.log('attempting to connect to a game room!');
        let game = JSON.parse(gameRoomJSON);
        for(let i = 0; i < game_rooms.length; i++){
            if (game_rooms[i].game_id == game.game_id){
                game_rooms[i].players.push(socket.id);
                socket.join(game_rooms[i].game_id);
                console.log("conn: " + JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    socket.on('leave_room', function(gameRoomJSON) {
        console.log('attempting to leave a game room!');
        let game = JSON.parse(gameRoomJSON);
        for(let j = 0; j < game_rooms.length; j++){
            if (game_rooms[j].game_id == game.game_id){
                for(let i = 0; i < game_rooms[j].players.length; i++){
                    if(game_rooms[j].players[i] == socket.id){
                        game_rooms[j].players.splice(i,1);
                        socket.leave(game_rooms[j].game_id);
                        console.log("disc: " + JSON.stringify(game_rooms[j]));
                    }
                }
            }
        }

    });
});

http.listen(port, function(){
    console.log('listening on *: ' + port);
});

function addGameRooms(socket){
    for(let i = 0; i < game_rooms.length; i++){
        socket.emit('add room', JSON.stringify(game_rooms[i]));
    }
}
