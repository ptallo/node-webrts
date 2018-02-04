'use strict';
var shortid = require('shortid');
var PhysicsComponent = require('./component/PhysicsComponent.js');
var RenderComponent = require('./component/RenderComponent.js');

class GameObject{
    constructor(x, y, width, height){
        this.id = shortid.generate();
        this.physicsComponent = new PhysicsComponent(this.id, x, y, width, height, 200);
        this.renderComponent = new RenderComponent('images/tree.png', this.physicsComponent);
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