//Imports
'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GameRoom = require("./core/GameRoom.js");
var Game = require('./core/Game.js');
var Player = require('./core/Player.js');
var port = 8080;

//Configuration
app.use(express.static(path.join(__dirname, '/public')));

//Variables
var game_rooms = [];
var games = [];

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    // The below functions pertain to setting up the lobbies and starting the game
    for(let i = 0; i < game_rooms.length; i++){
        socket.emit('add room', JSON.stringify(game_rooms[i]));
    }

    socket.on('add lobby', function(gameRoomName){
        let gameRoom = new GameRoom(gameRoomName);
        game_rooms.push(gameRoom);
        socket.emit('add room', JSON.stringify(gameRoom));
    });
    
    socket.on('add and join lobby', function(gameRoomName){
        let gameRoom = new GameRoom(gameRoomName);
        game_rooms.push(gameRoom);
        socket.emit('add room', JSON.stringify(gameRoom));
        socket.emit('join room', JSON.stringify(gameRoom));
    });

    socket.on('refresh lobby list', function(){
        for(let i = 0; i < game_rooms.length; i++){
            socket.emit('add room', JSON.stringify(game_rooms[i]));
        }
    });
    
    socket.on('join lobby', function (gameRoomJSON) {
        let gameRoom = JSON.parse(gameRoomJSON);
        for(let i = 0; i < game_rooms.length; i++){
            if (game_rooms[i].id == gameRoom.id){
                let player = new Player();
                game_rooms[i].addPlayer(player);
                socket.emit('get_player', JSON.stringify(player));
                io.to(gameRoom.id).emit('update game', JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    socket.on('leave lobby', function(gameRoomJSON, playerJSON) {
        let gameRoom = JSON.parse(gameRoomJSON);
        let player = JSON.parse(playerJSON);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == gameRoom.id){
                game_rooms[i].removePlayer(player);
                io.to(gameRoom.id).emit('update game', JSON.stringify(game_rooms[i]));
                socket.leave(game_rooms[i].id);
                if(game_rooms[i].players.length == 0){
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
    
    socket.on('update game lobby', function(gameRoomJSON){
        let gameRoom = JSON.parse(gameRoomJSON);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == gameRoom.id){
                socket.emit('update game', JSON.stringify(game_rooms[i]));
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
                    let game = new Game(game_rooms[i].players);
                    games.push(game);
                    io.to(gameLobby.id).emit('start game', game.id, JSON.stringify(game_rooms[i]));
                } else {
                    socket.emit('start game failed');
                }
            }
        }
    });
    
    socket.on('join io room', function(id){
        socket.join(id);
    });
    
    socket.on('leave io room', function(id){
        socket.leave(id);
    })
    
    //the below functions pertain to running the game
    socket.on('get game', function(gameId){
        for(let i = 0; i < games.length; i ++){
            if(games[i].id == gameId){
                socket.emit('get game', JSON.stringify(games[i]));
            }
        }
    });
});

http.listen(port, function(){
    console.log('listening on *: ' + port);
});
