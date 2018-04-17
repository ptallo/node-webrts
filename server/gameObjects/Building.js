var shortid = require('shortid');
var RenderComponent = require('../component/RenderComponent.js');
var RectPhysicsComponent = require('../component/RectPhysicsComponent.js');
var UnitCreationComponent = require('../component/UnitCreationComponent.js');
var Unit = require('../gameObjects/Unit.js');

class Building {
    constructor(x, y, width, height, url){
        this.type = "Building";
        this.id = shortid.generate();
        this.renderComponent = new RenderComponent(url);
        this.physicsComponent = new RectPhysicsComponent(this.id, x, y, width, height, 0);
        this.unitCreationComponent = new UnitCreationComponent();
        let unit = new Unit(200, 200, 8, 16, 29, 'images/character.png');
        this.unitCreationComponent.addUnitToQueue(unit, this.physicsComponent.rect);
        this.unitCreationComponent.setDestination(60, 60);
    }
    update(gameObjects, map){
        this.renderComponent.draw(this.physicsComponent.rect);
        this.physicsComponent.drawCollisionSize();
        let unit = this.unitCreationComponent.update(this.physicsComponent);
        if (unit !== null) {
            gameObjects.push(unit);
        }
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
    getCoords(){
        return this.physicsComponent.rect;
    }
}

module.exports = Building;