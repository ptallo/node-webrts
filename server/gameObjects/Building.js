var shortid = require('shortid');
var RenderComponent = require('../component/RenderComponent.js');
var RectPhysicsComponent = require('../component/RectPhysicsComponent.js');
var ActionComponent = require('../component/ActionComponent.js');

class Building {
    constructor(x, y, width, height, url){
        this.type = "Building";
        this.id = shortid.generate();
        this.renderComponent = new RenderComponent(url);
        this.physicsComponent = new RectPhysicsComponent(this.id, x, y, width, height, 0);
        this.actionComponent = new ActionComponent();
        let test = function(){
            console.log('testing');
        };
        this.actionComponent.addAction(test);
    }
    update(gameObjects, map){
        this.renderComponent.draw(this.physicsComponent.rect);
        this.physicsComponent.drawCollisionSize();
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
    getCoords(){
        return this.physicsComponent.rect;
    }
    activate(keyEvent){
        this.actionComponent.activate(keyEvent);
    }
}

module.exports = Building;