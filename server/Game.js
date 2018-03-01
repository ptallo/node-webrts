'use strict';
var shortid = require('shortid');
var GameObject = require('./GameObject.js');
var Map = require('./Map.js');
var Tile = require('./Tile.js');

class Game{
    constructor(id="none"){
        this.id = id == "none" ? shortid.generate() : id;
        this.gameObjects = [];
        // this.gameObjects.push(new GameObject(20, 20, 64, 64));
        // this.gameObjects.push(new GameObject(200, 200, 32, 32));
    }
    update(){
        if (typeof window !== 'undefined' && window.document) {
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            let image = new Image();
            image.url = 'images/basetile.png';
            context.drawImage(
                image,
                50,
                50,
                32,
                32
            );
        }
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update(this.gameObjects);
        }
    }
    moveObjects(objects, mouseCoords){
        for(let i = 0; i < this.gameObjects.length; i++){
            for(let j = 0; j < objects.length; j++){
                if (this.gameObjects[i].id == objects[j].id){
                    this.gameObjects[i].updateDestination(mouseCoords.x, mouseCoords.y);
                }
            }
        }
    }
}

module.exports = Game;
