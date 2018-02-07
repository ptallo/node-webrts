'use strict';
var shortid = require('shortid');
var PhysicsComponent = require('./component/PhysicsComponent.js');
var RenderComponent = require('./component/RenderComponent.js');
var State = require('./component/State.js');

class GameObject{
    constructor(x, y, width, height){
        this.id = shortid.generate();
        this.state = State.IDLE;
        this.physicsComponent = new PhysicsComponent(this.id, x, y, width, height, 100);
        this.renderComponent = new RenderComponent(this.physicsComponent, 'images/cowboy.png', 32, 32, 7);
    }
    update(gameObjects){
        this.physicsComponent.update(gameObjects);
        this.renderComponent.draw();
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
}

module.exports = GameObject;