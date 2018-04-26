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
        this.unitCreationComponent.addUnit(unit);
        this.unitCreationComponent.updateDestination(100, 20);
    }
    update(gameObjects, map){
        this.renderComponent.draw(this.physicsComponent.rect);
        this.physicsComponent.update(gameObjects, map);
        this.physicsComponent.drawCollisionSize();
        this.unitCreationComponent.update(gameObjects, this.getLocation());
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
    getLocation(){
        return this.physicsComponent.rect;
    }
}

module.exports = Building;