'use strict';
var shortid = require('shortid');
var GameObject = require('./GameObject.js');

class Game{
    constructor(){
        this.id = shortid.generate();
        this.gameObjects = [];
        this.gameObjects.push(new GameObject(20, 20, 40, 40));
    }
}

module.exports = Game;
