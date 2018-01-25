'use strict';
var shortid = require('shortid');
var PhysicsComponent = require('./component/PhysicsComponent.js');

class GameObject{
    constructor(x, y, width, height){
        this.id = shortid.generate();
        this.physicsComponent = new PhysicsComponent(this.id, x, y, width, height, 200);
    }
    update(gameObjects){
        this.physicsComponent.update(gameObjects);
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
}

module.exports = GameObject;