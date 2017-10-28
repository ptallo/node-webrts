'use strict';
var shortid = require('shortid');

class GameRoom{
  constructor(name){
    this.name = name;
    this.num_players = 2;
    this.players = [];
    var date = new Date;
    this.game_id = shortid.generate();
  }
  add_player(pid){
    if (this.players.length <= 2){
      this.players.push(pid);
    } else {
      throw "There are too many players in this game room!";
    }
  }
  remove_player(pid){
    var indexToRemove = null;
    for(var i = 0; i < this.players.length; i++){
      if (this.players[i] == pid) {
        indexToRemove = i;
      }
    }
    if(indexToRemove != null){
      this.players.splice(indexToRemove,1);
    } else {
      throw "That player is no longer in this lobby!";
    }
  }
}

module.exports = GameRoom;
