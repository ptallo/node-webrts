'use strict';
var shortid = require('shortid');
var GameObject = require('./gameObjects/GameObject.js');
var Building = require('./gameObjects/Building.js');
var Map = require('./Map.js');

class Game{
    constructor(id="none"){
        this.type = "Game";
        this.id = id == "none" ? shortid.generate() : id;
        this.gameObjects = [];
        this.gameObjects.push(new GameObject(20, 200, 8, 16, 29, 'images/character.png'));
        this.gameObjects.push(new Building(0, 0, 128, 128, 'images/building.png'));
        this.gameObjects.push(new GameObject(200, 200, 8, 16, 29, 'images/character.png'));
        this.map = new Map();
    }
    update(){
        this.map.drawMap();
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update(this.gameObjects, this.map);
        }
    }
    moveObjects(objects, mouseCords){
        for(let i = 0; i < this.gameObjects.length; i++){
            for(let j = 0; j < objects.length; j++){
                if (this.gameObjects[i].id === objects[j].id){
                    this.gameObjects[i].updateDestination(mouseCords.x, mouseCords.y);
                }
            }
        }
    }
}

module.exports = Game;
