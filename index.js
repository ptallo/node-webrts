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
                socket.broadcast.to(game_rooms[i].game_id).emit('update_game', JSON.stringify(game_rooms[i]));
                console.log("conn: " + JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    socket.on('leave_room', function(game_id, player_id) {
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].game_id = game_id){
                for(let a = 0; a < game_rooms[i].players.length; a++){
                    if(game_rooms[i].players[a] == player_id){
                        game_rooms[i].players.splice(a,1);
                        socket.leave(game_rooms[i].game_id);
                        socket.broadcast.to(game_rooms[i].game_id).emit('update_game', JSON.stringify(game_rooms[i]));
                        console.log("disc: " + JSON.stringify(game_rooms[i]));
                    }
                }
            }
        }
    });
    
    socket.on('get_uid', function () {
       let uid = shortid.generate();
       socket.emit('get_uid', uid);
    });
    
    socket.on('start_game', function(game_room){
        socket.broadcast.to(game_room).emit('start_game');
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
