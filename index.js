//Imports
'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GameRoom = require("./server_js/GameRoom.js");
var Player = require('./server_js/Player.js');
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
        socket.emit('add room', JSON.stringify(game));
        socket.emit('join room', JSON.stringify(game));
    });

    socket.on('refresh', function(){
        for(let i = 0; i < game_rooms.length; i++){
            socket.emit('add room', JSON.stringify(game_rooms[i]));
        }
    });
    
    socket.on('join_room', function (game_json) {
        let game = JSON.parse(game_json);
        for(let i = 0; i < game_rooms.length; i++){
            if (game_rooms[i].id == game.id){
                let player = new Player();
                game_rooms[i].addPlayer(player);
                socket.emit('get_player', JSON.stringify(player));
                console.log("Conn: " + JSON.stringify(game_rooms[i]));
            }
        }
    
    });
    
    socket.on('leave_room', function(game_json, player_json) {
        let game = JSON.parse(game_json);
        let player = JSON.parse(player_json);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == game.id){
                game_rooms[i].removePlayer(player);
                console.log("Disc: " + JSON.stringify(game_rooms[i]));
                if(game_rooms[i].players.length == 0){
                    console.log('removed room: ' + JSON.stringify(game_rooms[i]));
                    game_rooms.splice(i,1);
                }
            }
        }
    });
    
    socket.on('get_game', function(game_json){
        let game = JSON.parse(game_json);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == game.id){
                socket.emit('get_game', JSON.stringify(game_rooms[i]));
            }
        }
    });
});

http.listen(port, function(){
    console.log('listening on *: ' + port);
});
