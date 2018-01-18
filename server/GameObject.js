'use strict';
var shortid = require('shortid');
var PositionComponent = require('./component/PositionComponent.js');
var SizeComponent = require('./component/SizeComponent.js');
var VelocityComponent = require('./component/VelocityComponent.js');
var DestinationComponent = require('./component/DestinationComponent.js');

class GameObject{
    constructor(x, y, width, height){
        this.id = shortid.generate();
        this.sizeComponent = new SizeComponent(width, height);
        this.positionComponent = new PositionComponent(x, y);
        this.destinationComponent = new DestinationComponent();
        this.velocityComponent = new VelocityComponent();
    }
    update(){
        if(this.destinationComponent.x != this.positionComponent.x){
            let coeff = (this.positionComponent.x > this.destinationComponent.x) ? -1 : 1;
            this.positionComponent.x += (this.velocityComponent.xVelocity * coeff);
        }
        
        if(this.destinationComponent.y != this.positionComponent.y){
            let coeff = this.positionComponent.y > this.destinationComponent.y ? -1 : 1;
            this.positionComponent.y += (this.velocityComponent.yVelocity * coeff);
        }
    }
    moveObject(point){
        this.destinationComponent.updateDestination(point.x, point.y);
    }
}

module.exports = GameObject;