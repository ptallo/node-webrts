'use strict';
var shortid = require('shortid');
var PhysicsComponent = require('./component/PhysicsComponent.js');
var RenderComponent = require('./component/RenderComponent.js');
var SpriteSheetRenderComponent = require('./component/SpriteSheetRenderComponent.js');

class GameObject{
    constructor(x, y, width, height){
        this.id = shortid.generate();
        this.physicsComponent = new PhysicsComponent(this.id, x, y, width, height, 100);
        this.renderComponent = new SpriteSheetRenderComponent('images/cowboy.png', this.physicsComponent, 32, 32, 7);
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