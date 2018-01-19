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
        this.destinationComponent = new DestinationComponent(x, y);
        this.velocityComponent = new VelocityComponent();
    }
    update(){
        if(this.positionComponent.x != this.destinationComponent.x){
            let coeff = this.positionComponent.x > this.destinationComponent.x ? -1 : 1;
            if (Math.abs(this.positionComponent.x - this.destinationComponent.x) < this.velocityComponent.xVelocity) {
                this.positionComponent.x = this.destinationComponent.x;
            } else {
                this.positionComponent.x += coeff * this.velocityComponent.xVelocity;
            }
        }

        if(this.positionComponent.y != this.destinationComponent.y){
            let coeff = this.positionComponent.y > this.destinationComponent.y ? -1 : 1;
            if(Math.abs(this.positionComponent.y - this.destinationComponent.y) < this.velocityComponent.yVelocity){
                this.positionComponent.y = this.destinationComponent.y;
            } else {
                this.positionComponent.y += coeff * this.velocityComponent.yVelocity;
            }
        }
    }
}

module.exports = GameObject;