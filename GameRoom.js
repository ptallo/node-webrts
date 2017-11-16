'use strict';
var shortid = require('shortid');

class GameRoom{
    constructor(name){
        this.name = name;
        this.players = [];
        this.num_players = 2;
        this.game_id = shortid.generate();
    }
    add_player(player_json){
        let player = JSON.parse(player_json);
        if (this.players.length < this.num_players){
            this.players.push(player);
        } else {
            throw "There are too many players in this game room!";
        }
    }
    remove_player(player_json){
        let player = JSON.parse(player_json);
        for(let i = 0; i < this.players.length; i++){
            if (this.players[i].id == player.ID) {
                try {
                    this.players.splice(i, 1);
                } catch (e) {
                    throw "That player is no longer in this room!";
                }
            }
        }
    }
}

module.exports = GameRoom;
