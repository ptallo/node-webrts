'use strict';
var shortid = require('shortid');

class Player{
    constructor(){
        this.id = shortid.generate();
        this.isReady = false;
        this.mousedown = false;
        this.selectedGameObjects = [];
    }
}

module.exports = Player;
