var Unit = require('../gameObjects/Unit.js');
var Utility = require('../Utility.js');

class UnitCreationComponent{
    constructor(){
        this.type = "UnitCreationComponent";
        this.queue = [];
        this.constructionTime = 1000;
        this.timeStamp = Date.now();
        this.destination = {
            x : null,
            y : null
        };
    }
    addUnit(unit){
        this.queue.push(unit);
    }
    getUnit(){
        return this.queue.shift();
    }
    updateDestination(x, y){
        this.destination = {
            x : x,
            y : y
        };
    }
    update(gameObjects, coordinates){
        if (Date.now() - this.timeStamp > this.constructionTime && this.queue.length > 0){
            this.timeStamp = Date.now();
            let unit = this.getUnit();
            if (typeof unit !== "undefined"){
                // unit.physicsComponent.updateDestination(this.destination.x, this.destination.y);
                this.positionUnit(unit, coordinates);
                gameObjects.push(unit);
            }
        }
    }
    positionUnit(unit, coordinates){
        unit.physicsComponent.setPosition(coordinates.x - 20, coordinates.y - 20);
    }
}

module.exports = UnitCreationComponent;