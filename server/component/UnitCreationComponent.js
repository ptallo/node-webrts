var Unit = require('../gameObjects/Unit.js');
var Utility = require('../Utility.js');

class UnitCreationComponent {
    constructor(){
        this.type = "UnitCreationComponent";
        this.queue = [];
        this.creationTime = 5000; // 5000 milliseconds, 5 second
        this.timeStamp = Date.now();
        this.destinationPoint = {
            x : 0,
            y : 0
        }
    }
    update(physicsComponent){
        if (Date.now() - this.timeStamp > this.creationTime && this.queue.length > 0){
            let unit = this.getUnitFromQueue();
            unit.updateDestination(this.destinationPoint.x, this.destinationPoint.y);
            this.setUnitPosition(unit, physicsComponent);
            return unit;
        }
        return null;
    }
    addUnitToQueue(unit){
        this.queue.push(unit);
    }
    getUnitFromQueue(){
        return this.queue.shift();
    }
    setDestination(x, y){
        this.destinationPoint = {
            x : x,
            y : y
        };
    }
    //Based on where the unit is trying to go to this should place it adjacent to the current object
    setUnitPosition(unit, physicsComponent){
        let xDistance = null;
        let yDistance = null;
        if (physicsComponent.type === "RectPhysicsComponent"){
            xDistance = physicsComponent.rect.x + (physicsComponent.rect.width / 2) - this.destinationPoint.x;
            yDistance = physicsComponent.rect.y + (physicsComponent.rect.height / 2) - this.destinationPoint.y;
        } else if (physicsComponent.type === "CirclePhysicsComponent"){
            xDistance = physicsComponent.circle.x - this.destinationPoint.x;
            yDistance = physicsComponent.circle.y - this.destinationPoint.y;
        }
    
        let distance = Math.sqrt(Math.pow(xDistance,2) + Math.pow(yDistance,2));
        let theta = Math.asin(yDistance / distance);
        let percentage = 0;
        do {
            percentage += 1;
            let tempDistance = distance * percentage / 100;
            let newX = tempDistance * Math.sin(theta);
            let newY = tempDistance * Math.cos(theta);
            unit.physicsComponent.setPosition(newX, newY);
        } while (Utility.checkUnknownObjectCollision(unit.physicsComponent, physicsComponent));
    }
}

module.exports = UnitCreationComponent;