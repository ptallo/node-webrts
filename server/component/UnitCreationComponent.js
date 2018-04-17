var Unit = require('../gameObjects/Unit.js');
var Utility = require('../Utility.js');

class UnitCreationComponent {
    constructor(){
        this.type = "UnitCreationComponent";
        this.queue = [];
        this.creationTime = 1000; // 5000 milliseconds, 5 second
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
    addUnitToQueue(unit, point){
        unit.physicsComponent.setPosition(point.x, point.y);
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
        let initialPosition = {
            x : 0,
            y : 0
        };
        
        let directionModifier = {
            x : 1,
            y : 1
        };
        
        if (physicsComponent.type === "RectPhysicsComponent"){
            initialPosition.x = physicsComponent.rect.x;
            initialPosition.y = physicsComponent.rect.y;
            xDistance = Math.abs(initialPosition.x - this.destinationPoint.x);
            yDistance = Math.abs(initialPosition.y - this.destinationPoint.y);
        } else if (physicsComponent.type === "CirclePhysicsComponent"){
            initialPosition.x = physicsComponent.circle.x;
            initialPosition.y = physicsComponent.circle.y;
            xDistance = Math.abs(initialPosition.x - this.destinationPoint.x);
            yDistance = Math.abs(initialPosition.y - this.destinationPoint.y);
        }
    
        if (initialPosition.x > this.destinationPoint.x){
            directionModifier.x = -1;
        }
    
        if (initialPosition.y > this.destinationPoint.y){
            directionModifier.y = -1;
        }
        
        let distance = Math.sqrt(Math.pow(xDistance,2) + Math.pow(yDistance,2));
        let theta = Math.asin(yDistance / distance);
        let increment = 0;
    
        let distanceIncrement = distance * 0.01;
        let xIncrement = distanceIncrement * Math.cos(theta);
        let yIncrement = distanceIncrement * Math.sin(theta);
        
        do {
            increment += 1;
            unit.physicsComponent.setPosition(
                initialPosition.x + (xIncrement * increment * directionModifier.x),
                initialPosition.y + (yIncrement * increment * directionModifier.y)
            );
        } while(Utility.checkUnknownObjectCollision(unit.physicsComponent, physicsComponent));
    }
}

module.exports = UnitCreationComponent;