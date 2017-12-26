'use strict';
var shortid = require('shortid');
var gameObject = require('./GameObject.js');

class Game{
    constructor(players){
        this.id = shortid.generate();
        this.gameObjects = [];
    }
}

module.exports = Game;
