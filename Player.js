'use strict';
var shortid = require('shortid');

class Player{
    constructor(){
        this.id = shortid.generate();
        this.isReady = false;
    }
}

module.exports = Player;