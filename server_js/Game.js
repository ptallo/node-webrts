'use strict';
var shortid = require('shortid');

class Game{
    constructor(players){
        this.id = shortid.generate();
        this.players = players;
    }
}

module.exports = Game;
