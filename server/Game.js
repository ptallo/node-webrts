'use strict';
var shortid = require('shortid');
var GameObject = require('./GameObject.js');

class Game{
    constructor(id="none"){
        this.id = id == "none" ? shortid.generate() : id;
        this.gameObjects = [];
        this.gameObjects.push(new GameObject(20, 20, 40, 40));
        this.gameObjects.push(new GameObject(80, 80, 100, 20));
    }
    update(tickRate){
        for (let i = 0; i < this.gameObjects.length; i++) {
            let collided = false;
            let iRect = this.gameObjects[i].getNewPosRect(tickRate);
            
            for (let j = 0; j < this.gameObjects.length; j++){
                if (i != j){
                    collided = this.gameObjects[j].checkCollision(iRect);
                }
            }
            
            if (!collided){
                this.gameObjects[i].updatePosition(iRect);
            }
        }
    }
    moveObjects(objects, mouseCoords){
        for(let i = 0; i < this.gameObjects.length; i++){
            for(let j = 0; j < objects.length; j++){
                if (this.gameObjects[i].id == objects[j].id){
                    this.gameObjects[i].destinationComponent.updateDestination(mouseCoords.x, mouseCoords.y);
                }
            }
        }
    }
}

module.exports = Game;
