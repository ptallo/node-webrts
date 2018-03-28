var shortid = require('shortid');
var RenderComponent = require('../component/RenderComponent.js');
var ActionComponent = require('../component/ActionComponent.js');
var RectPhysicsComponent = require('../component/RectPhysicsComponent.js');

class Building {
    constructor(x, y, width, height, url){
        this.id = shortid.generate();
        this.renderComponent = new RenderComponent(url);
        this.physicsComponent = new RectPhysicsComponent(this.id, x, y, width, height, 0);
        this.actionComponent = new ActionComponent();
    }
    update(gameObjects, map){
        this.renderComponent.draw(this.physicsComponent.rect);
        this.physicsComponent.drawCollisionSize();
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
}

module.exports = Building;