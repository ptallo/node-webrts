var shortid = require('shortid');
var RenderComponent = require('../component/RenderComponent.js');
var RectPhysicsComponent = require('../component/RectPhysicsComponent.js');
var Unit = require('../gameObjects/Unit.js');

class Building {
    constructor(x, y, width, height, url){
        this.type = "Building";
        this.id = shortid.generate();
        this.renderComponent = new RenderComponent(url);
        this.physicsComponent = new RectPhysicsComponent(this.id, x, y, width, height, 0);
    }
    update(gameObjects, map){
        this.renderComponent.draw(this.physicsComponent.rect);
        this.physicsComponent.update(gameObjects, map);
        this.physicsComponent.drawCollisionSize();
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
    getCoords(){
        return this.physicsComponent.rect;
    }
}

module.exports = Building;