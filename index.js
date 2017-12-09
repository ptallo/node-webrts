//Imports
'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var GameRoom = require("./server_js/GameRoom.js");
var Player = require('./server_js/Player.js');
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
                console.log("Conn: " + JSON.stringify(game_rooms[i]));
                game_rooms[i].addPlayer(player);
                socket.emit('get_player', JSON.stringify(player));
                io.to(game.id).emit('update game', JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    socket.on('leave_room', function(game_json, player_json) {
        let game = JSON.parse(game_json);
        let player = JSON.parse(player_json);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == game.id){
                console.log("Disc: " + JSON.stringify(game_rooms[i]));
                game_rooms[i].removePlayer(player);
                io.to(game.id).emit('update game', JSON.stringify(game_rooms[i]));
                socket.leave(game_rooms[i].id);
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
                socket.emit('update game', JSON.stringify(game_rooms[i]));
            }
        }
    });
    
    
    socket.on('update_player', function(game_json, player_json) {
        let game = JSON.parse(game_json);
        let player = JSON.parse(player_json);
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == game.id){
                for(let j = 0; j < game_rooms[i].players.length; j++) {
                    if(game_rooms[i].players[j].id == player.id){
                        game_rooms[i].players[j].isReady = player.isReady;
                        io.to(game.id).emit('update game', JSON.stringify(game_rooms[i]));
                    }
                }
            }
        }
    });
    
    socket.on('check game ready', function(game_json){
        let game = JSON.parse(game_json);
        let game_id = game.id;
        for(let i = 0; i < game_rooms.length; i++){
            if(game_rooms[i].id == game_id){
                let ready = game_rooms[i].checkReady();
                socket.emit('start_game', JSON.stringify(ready));
                //TODO start game here on backend
            }
        }
    });
    
    socket.on('join io room', function(game_json){
        let game = JSON.parse(game_json);
        socket.join(game.id);
    });
});

http.listen(port, function(){
    console.log('listening on *: ' + port);
});
