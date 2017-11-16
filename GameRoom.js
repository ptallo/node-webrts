'use strict';
var shortid = require('shortid');

class GameRoom{
    constructor(name){
        this.name = name;
        this.players = [];
        this.num_players = 2;
        this.game_id = shortid.generate();
    }
    addPlayer(player_json){
        let player = JSON.parse(player_json);
        if (this.players.length < this.num_players){
            this.players.push(player);
        } else {
            throw "There are too many players in this game room!";
        }
    }
    removePlayer(player_json){
        let player = JSON.parse(player_json);
        for(let i = 0; i < this.players.length; i++){
            if (this.players[i].id == player.id) {
                try {
                    this.players.splice(i, 1);
                } catch (e) {
                    throw "That player is no longer in this room!";
                }
            }
        }
    }
    updatePlayer(player_json){
        let player = JSON.parse(player_json);
        for(let i = 0; i < this.players.length; i++){
            if(this.players[i].id == player.id){
                this.players[i] == player;
            }
        }
    }
}

module.exports = GameRoom;
