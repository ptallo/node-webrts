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
    for(let i = 0; i < game_rooms.length; i++){
        socket.emit('add room', JSON.stringify(game_rooms[i]));
    }

    socket.on('add lobby', function(game_name){
        let game = new GameRoom(game_name);
        game_rooms.push(game);
        socket.emit('add room', JSON.stringify(game));
    });
    
    socket.on('add and join', function(game_name){
        let game = new GameRoom(game_name);
        game_rooms.push(game);
        socket.emit('add and join', JSON.stringify(game));
    });

    socket.on('refresh', function(){
        for(let i = 0; i < game_rooms.length; i++){
            socket.emit('add room', JSON.stringify(game_rooms[i]));
        }
    });
    
    socket.on('join_room', function (game_id, player_id) {
        for(let i = 0; i < game_rooms.length; i++){
            if (game_rooms[i].game_id == game_id){
                game_rooms[i].add_player(player_id);
                socket.join(game_rooms[i].game_id);
                socket.broadcast.to(game_rooms[i].game_id).emit('update_game', JSON.stringify(game_rooms[i]));
                console.log("conn: " + JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    socket.on('leave_room', function(game_id, player_id) {
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].game_id == game_id){
                game_rooms[i].remove_player(player_id);
                socket.leave(game_rooms[i].game_id);
                socket.broadcast.to(game_rooms[i].game_id).emit('update_game', JSON.stringify(game_rooms[i]));
                console.log("disc: " + JSON.stringify(game_rooms[i]));
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
