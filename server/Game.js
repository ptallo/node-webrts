'use strict';
var shortid = require('shortid');
var Unit = require('./gameObjects/Unit.js');
var Building = require('./gameObjects/Building.js');
var Map = require('./Map.js');

class Game{
    constructor(id="none"){
        this.type = "Game";
        this.id = id == "none" ? shortid.generate() : id;
        this.gameObjects = [];
        this.gameObjects.push(new Building(256, 256, 128, 128, 'images/building.png'));
        this.map = new Map();
    }
    update(){
        this.map.drawMap();
        this.gameObjects = this.mergeSortGameObjects(this.gameObjects);
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
    activate(keyEvent, gameObjects){
        for (let i = 0; i < this.gameObjects.length; i++){
            for (let j = 0; j < gameObjects.length; j++){
                if (this.gameObjects[i].id === gameObjects[j].id){
                    this.gameObjects[i].activate(keyEvent);
                }
            }
        }
    }
    mergeSortGameObjects(gameObjects){
        if (gameObjects.length < 2) {
            return gameObjects;
        }
        let mid = Math.floor(gameObjects.length / 2);
        let left = gameObjects.slice(0, mid);
        let right = gameObjects.slice(mid);
        
        return this.mergeObjects(this.mergeSortGameObjects(left), this.mergeSortGameObjects(right));
    }
    mergeObjects(left, right){
        let results = [],
            l = 0,
            r = 0;
        while (l < left.length && r < right.length){
            if (left[l].getCoords().y < right[r].getCoords().y) {
                results.push(left[l]);
                l++;
            } else {
                results.push(right[r]);
                r++;
            }
        }
        return results.concat(left.slice(l)).concat(right.slice(r));
    }
}

module.exports = Game;
