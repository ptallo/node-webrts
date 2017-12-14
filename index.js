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

    socket.on('add lobby', function(gameRoomName){
        let gameRoom = new GameRoom(gameRoomName);
        game_rooms.push(gameRoom);
        socket.emit('add room', JSON.stringify(gameRoom));
    });
    
    socket.on('add and join', function(gameRoomName){
        let gameRoom = new GameRoom(gameRoomName);
        game_rooms.push(gameRoom);
        socket.emit('add room', JSON.stringify(gameRoom));
        socket.emit('join room', JSON.stringify(gameRoom));
    });

    socket.on('refresh', function(){
        for(let i = 0; i < game_rooms.length; i++){
            socket.emit('add room', JSON.stringify(game_rooms[i]));
        }
    });
    
    socket.on('join_room', function (gameRoomJSON) {
        let gameRoom = JSON.parse(gameRoomJSON);
        for(let i = 0; i < game_rooms.length; i++){
            if (game_rooms[i].id == gameRoom.id){
                let player = new Player();
                console.log("Conn: " + JSON.stringify(game_rooms[i]));
                game_rooms[i].addPlayer(player);
                socket.emit('get_player', JSON.stringify(player));
                io.to(gameRoom.id).emit('update game', JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    socket.on('leave_room', function(gameRoomJSON, playerJSON) {
        let gameRoom = JSON.parse(gameRoomJSON);
        let player = JSON.parse(playerJSON);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == gameRoom.id){
                console.log("Disc: " + JSON.stringify(game_rooms[i]));
                game_rooms[i].removePlayer(player);
                io.to(gameRoom.id).emit('update game', JSON.stringify(game_rooms[i]));
                socket.leave(game_rooms[i].id);
                if(game_rooms[i].players.length == 0){
                    console.log('removed room: ' + JSON.stringify(game_rooms[i]));
                    game_rooms.splice(i,1);
                }
            }
        }
    });
    
    socket.on('update lobby', function(gameRoomJSON, playerJSON) {
        let gameRoom = JSON.parse(gameRoomJSON);
        let player = JSON.parse(playerJSON);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == gameRoom.id){
                for(let j = 0; j < game_rooms[i].players.length; j++) {
                    if(game_rooms[i].players[j].id == player.id){
                        game_rooms[i].players[j].isReady = player.isReady;
                        io.to(gameRoom.id).emit('update game', JSON.stringify(game_rooms[i]));
                    }
                }
            }
        }
    });
    
    socket.on('check game ready', function(gameJSON){
        let gameLobby = JSON.parse(gameJSON);
        let gameId = gameLobby.id;
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == gameId){
                let ready = game_rooms[i].checkReady();
    
                if (ready && game_rooms[i].players.length > 1){
                    console.log('start game');
                    let game = new Game(game_rooms[i].players);
                    games.push(game);
                    io.to(gameLobby.id).emit('start game', game.id, game_rooms[i].id);
                } else {
                    socket.emit('start game failed');
                }
            }
        }
    });
    
    socket.on('get game lobby', function(gameRoomJSON){
        let gameRoom = JSON.parse(gameRoomJSON);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == gameRoom.id){
                socket.emit('update game', JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    socket.on('get game', function(gameId){
       for(let i = 0; i < games.length; i ++){
           if(games[i].id == gameId){
               socket.emit('update game', JSON.stringify(games[i]));
           }
       }
    });
    
    socket.on('join io room', function(gameRoomJSON){
        let gameRoom = JSON.parse(gameRoomJSON);
        socket.join(gameRoom.id);
    });
    
    socket.on('leave io room', function(gameRoomJSON){
        let gameRoom = JSON.parse(gameRoomJSON);
        socket.leave(gameRoom.id);
    })
});

http.listen(port, function(){
    console.log('listening on *: ' + port);
});
