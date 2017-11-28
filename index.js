//Imports
'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GameRoom = require("./GameRoom.js");
var Player = require('./Player.js');
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
    
    socket.on('join_room', function (game_json, player_json) {
        let game = JSON.parse(game_json);
        for(let i = 0; i < game_rooms.length; i++){
            if (game_rooms[i].game_id == game.game_id){
                game_rooms[i].addPlayer(player_json);
                socket.join(game_rooms[i].game_id);
                socket.to(game_rooms[i].game_id).emit('get_game', JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    socket.on('leave_room', function(game_json, player_json) {
        let game = JSON.parse(game_json);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].game_id == game.game_id){
                game_rooms[i].removePlayer(player_json);
                socket.leave(game_rooms[i].game_id);
                socket.to(game_rooms[i].game_id).emit('get_game', JSON.stringify(game_rooms[i]));
                if(game_rooms[i].players.length == 0){
                    game_rooms.splice(i, 1);
                }
            }
        }
    });
    
    socket.on('get_player', function () {
        let player  = new Player();
        socket.emit('get_player', JSON.stringify(player));
    });
    
    socket.on('get_game', function(game_id){
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].game_id == game_id){
                socket.emit('get_game', JSON.stringify(game_rooms[i]))
            }
        }
    });
    
    socket.on('start game', function(game_id){
        let game = null;
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].game_id == game_id){
                game = game_rooms[i];
            }
        }
        
        if(game != null && game.checkReady()){
            socket.emit('start game');
        } else {
            socket.emit('game start failed');
        }
    });
    
    socket.on('update_player', function(game_json, player_json){
        let player = JSON.parse(player_json);
        let game = JSON.parse(game_json);
        for(let i = 0; i < game_rooms.length; i++){
           if(game_rooms[i].game_id == game.game_id){
               game_rooms[i].updatePlayer(player);
           }
        }
    });
});

http.listen(port, function(){
    console.log('listening on *: ' + port);
});
