var Utility = require('../Utility.js');

class UnitCreationComponent{
    constructor(){
        this.type = "UnitCreationComponent";
        this.queue = [];
        this.constructionTime = 0;
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
    update(gameObjects, physicsComponent){
        if (Date.now() - this.timeStamp > this.constructionTime && this.queue.length > 0){
            this.timeStamp = Date.now();
            let testUnit = this.getUnit();
            let unit = Object.assign(Object.create(Object.getPrototypeOf(testUnit)), testUnit);
            if (typeof unit !== "undefined"){
                // unit.physicsComponent.updateDestination(this.destination.x, this.destination.y);
                // this.positionUnit(unit, physicsComponent);
                unit.updateDestination(20, 300);
                gameObjects.push(unit);
            }
        }
    }
    positionUnit(unit, physicsComponent){
        let startPoint = {};
        if (physicsComponent.type === "RectPhysicsComponent"){
            startPoint.x = physicsComponent.rect.x + (physicsComponent.rect.width / 2);
            startPoint.y = physicsComponent.rect.y + (physicsComponent.rect.height / 2);
        } else if (physicsComponent.type === "CirclePhysicsComponent"){
            startPoint.x = physicsComponent.circle.x;
            startPoint.y = physicsComponent.circle.y;
        }
        
        let xyDistance = {
            x : startPoint.x - this.destination.x,
            y : startPoint.y - this.destination.y
        };
        let distance = Math.sqrt(Math.pow(xyDistance.x, 2) + Math.pow(xyDistance.y, 2));
        let theta = Math.asin(xyDistance.y / distance);
        let percentage = 0;
        
        let point = startPoint;
        while (Utility.checkUnknownObjectCollision(unit.physicsComponent, physicsComponent)){
            percentage += 0.01;
            point.x = startPoint.x + (Math.cos(theta) * distance * percentage);
            point.y = startPoint.y + (Math.sin(theta) * distance * percentage);
            unit.physicsComponent.setPosition(point.x, point.y);
        }
    }
}

module.exports = UnitCreationComponent;