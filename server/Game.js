'use strict';
var shortid = require('shortid');
var GameObject = require('./GameObject.js');

class Game{
    constructor(id="none"){
        this.id = id == "none" ? shortid.generate() : id;
        this.gameObjects = [];
        this.gameObjects.push(new GameObject(20, 20, 40, 40));
        this.gameObjects.push(new GameObject(80, 80, 100, 20))
    }
    update(){
        for(let object in this.gameObjects){
            object.update();
        }
    }
}

module.exports = Game;
