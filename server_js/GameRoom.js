'use strict';
var shortid = require('shortid');

class GameRoom{
    constructor(name){
        this.name = name;
        this.players = [];
        this.id = shortid.generate();
    }
    addPlayer(player){
        this.players.push(player);
    }
    removePlayer(player){
        for(let i = 0; i < this.players.length; i++){
            if (this.players[i].id == player.id){
                this.players.splice(i,1);
            }
        }
    }
    updatePlayer(player){
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].id == player.id){
                this.players[i] = player;
            }
        }
    }
}

module.exports = GameRoom;
