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
        this.renderComponent = new RenderComponent(this.physicsComponent, 'images/character.png');
        this.renderComponent.addAnimation(State.IDLE, 2, 4, 32, 32);
        this.renderComponent.addAnimation(State.WALKING, 6, 4, 32, 32);
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