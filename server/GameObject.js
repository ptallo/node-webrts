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
    update(tickRate){
        let distance = Math.sqrt(Math.pow(this.destinationComponent.x - this.positionComponent.x, 2) + Math.pow(this.destinationComponent.y - this.positionComponent.y, 2));
        let xDistance = Math.abs(this.positionComponent.x - this.destinationComponent.x);
        let yDistance = Math.abs(this.positionComponent.y - this.destinationComponent.y);

        let cos = Math.cos(xDistance / distance);
        let sin = Math.sin(yDistance / distance);

        let xMove = this.velocityComponent.speed * (1/1000 * tickRate) * Math.cos(cos);
        let yMove = this.velocityComponent.speed * (1/1000 * tickRate) * Math.sin(sin);

        if(this.positionComponent.x != this.destinationComponent.x){
            let coeff = this.positionComponent.x > this.destinationComponent.x ? -1 : 1;
            if (Math.abs(this.positionComponent.x - this.destinationComponent.x) < xMove) {
                this.positionComponent.x = this.destinationComponent.x;
            } else {
                this.positionComponent.x += coeff * xMove;
            }
        }

        if(this.positionComponent.y != this.destinationComponent.y){
            let coeff = this.positionComponent.y > this.destinationComponent.y ? -1 : 1;
            if(Math.abs(this.positionComponent.y - this.destinationComponent.y) < yMove){
                this.positionComponent.y = this.destinationComponent.y;
            } else {
                this.positionComponent.y += coeff * yMove;
            }
        }
    }
}

module.exports = GameObject;