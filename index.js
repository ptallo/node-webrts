//Imports
'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GameRoom = require("./server_js/GameRoom.js");
var Game = require('./server_js/Game.js');
var Player = require('./server_js/Player.js');
var port = 8080;

//Configuration
app.use(express.static(__dirname + '/public'));

//Variables
var game_rooms = [];
var games = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    for(let i = 0; i < game_rooms.length; i++){
        socket.emit('add room', JSON.stringify(game_rooms[i]));
    }

    socket.on('add lobby', function(game_room_name){
        let game_room = new GameRoom(game_room_name);
        game_rooms.push(game_room);
        socket.emit('add room', JSON.stringify(game_room));
    });
    
    socket.on('add and join', function(game_room_name){
        let game_room = new GameRoom(game_room_name);
        game_rooms.push(game_room);
        socket.emit('add room', JSON.stringify(game_room));
        socket.emit('join room', JSON.stringify(game_room));
    });

    socket.on('refresh', function(){
        for(let i = 0; i < game_rooms.length; i++){
            socket.emit('add room', JSON.stringify(game_rooms[i]));
        }
    });
    
    socket.on('join_room', function (game_room_json) {
        let game_room = JSON.parse(game_room_json);
        for(let i = 0; i < game_rooms.length; i++){
            if (game_rooms[i].id == game_room.id){
                let player = new Player();
                console.log("Conn: " + JSON.stringify(game_rooms[i]));
                game_rooms[i].addPlayer(player);
                socket.emit('get_player', JSON.stringify(player));
                io.to(game_room.id).emit('update game', JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    socket.on('leave_room', function(game_room_json, player_json) {
        let game_room = JSON.parse(game_room_json);
        let player = JSON.parse(player_json);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == game_room.id){
                console.log("Disc: " + JSON.stringify(game_rooms[i]));
                game_rooms[i].removePlayer(player);
                io.to(game_room.id).emit('update game', JSON.stringify(game_rooms[i]));
                socket.leave(game_rooms[i].id);
                if(game_rooms[i].players.length == 0){
                    console.log('removed room: ' + JSON.stringify(game_rooms[i]));
                    game_rooms.splice(i,1);
                }
            }
        }
    });
    
    socket.on('get_game', function(game_room_json){
        let game_room = JSON.parse(game_room_json);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == game_room.id){
                socket.emit('update game', JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    
    socket.on('update lobby', function(game_room_json, player_json) {
        let game_room = JSON.parse(game_room_json);
        let player = JSON.parse(player_json);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == game_room.id){
                for(let j = 0; j < game_rooms[i].players.length; j++) {
                    if(game_rooms[i].players[j].id == player.id){
                        game_rooms[i].players[j].isReady = player.isReady;
                        io.to(game_room.id).emit('update game', JSON.stringify(game_rooms[i]));
                    }
                }
            }
        }
    });
    
    socket.on('check game ready', function(game_json){
        let game_lobby = JSON.parse(game_json);
        let game_id = game_lobby.id;
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == game_id){
                let ready = game_rooms[i].checkReady();
    
                if (ready && game_rooms[i].players.length > 1){
                    console.log('start game');
                    let game = new Game(game_rooms[i].players);
                    games.push(game);
                    io.to(game_lobby.id).emit('start game', game.id);
                } else {
                    socket.emit('start game failed');
                }
            }
        }
    });
    
    socket.on('join io room', function(game_room_json){
        let game_room = JSON.parse(game_room_json);
        socket.join(game_room.id);
    });
});

http.listen(port, function(){
    console.log('listening on *: ' + port);
});
