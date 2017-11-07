//Imports
'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GameRoom = require("./GameRoom.js");
var shortid = require('shortid');
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
    
    socket.on('join_room', function (gameRoomJSON, player_id) {
        let game = JSON.parse(gameRoomJSON);
        for(let i = 0; i < game_rooms.length; i++){
            if (game_rooms[i].game_id == game.game_id){
                game_rooms[i].players.push(player_id);
                socket.join(game_rooms[i].game_id);
                console.log('conn: ' + gameRoomJSON);
            }
        }
    });
    
    socket.on('leave_room', function(gameRoomJSON, player_id) {
        let game = JSON.parse(gameRoomJSON);
        for(let j = 0; j < game_rooms.length; j++){
            if (game_rooms[j].game_id == game.game_id){
                for(let i = 0; i < game_rooms[j].players.length; i++){
                    if(game_rooms[j].players[i] == player_id){
                        game_rooms[j].players.splice(i,1);
                        socket.leave(game_rooms[j].game_id);
                        console.log('disc: ' + gameRoomJSON);
                    }
                }
            }
        }
    });
    
    socket.on('get_uid', function () {
       let uid = shortid.generate();
       socket.emit('get_uid', uid);
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
