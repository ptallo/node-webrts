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
    getNewPosRect(tickRate){
        let distance = Math.sqrt(Math.pow(this.destinationComponent.x - this.positionComponent.x, 2) + Math.pow(this.destinationComponent.y - this.positionComponent.y, 2));
        let xDistance = Math.abs(this.positionComponent.x - this.destinationComponent.x);
        let yDistance = Math.abs(this.positionComponent.y - this.destinationComponent.y);
    
        let cos = xDistance / distance;
        let sin = yDistance / distance;
        
        let move = {
            x : this.velocityComponent.speed * (1/1000 * tickRate) * cos,
            y : this.velocityComponent.speed * (1/1000 * tickRate) * sin
        };
        
        let newX = null;
        if (this.destinationComponent.x != this.positionComponent.x){
            let coeff = this.destinationComponent.x < this.positionComponent.x ? -1 : 1;
            if (Math.abs(this.destinationComponent.x - this.positionComponent.x) < move.x) {
                newX = this.destinationComponent.x;
            } else {
                newX = this.positionComponent.x + move.x * coeff;
            }
        } else {
            newX = this.positionComponent.x;
        }
        
        let newY = null;
        if (this.destinationComponent.y != this.positionComponent.y){
            let coeff = this.destinationComponent.y < this.positionComponent.y ? -1 : 1;
            if (Math.abs(this.destinationComponent.y - this.positionComponent.y) < move.y){
                newY = this.destinationComponent.y;
            } else {
                newY = this.positionComponent.y + move.y * coeff;
            }
        } else {
            newY = this.positionComponent.y;
        }
    
        let newPosRect = {
            width : this.sizeComponent.width,
            height : this.sizeComponent.height,
            x : newX,
            y : newY
        }
        
        return newPosRect;
    }
    checkCollision(newPosRect){
        if (this.positionComponent.x < newPosRect.x + newPosRect.width &&
            this.positionComponent.x + this.sizeComponent.width > newPosRect.x &&
            this.positionComponent.y < newPosRect.y + newPosRect.height &&
            this.positionComponent.y + this.sizeComponent.height  > newPosRect.y) {
            // collision detected!
            return true;
        }
        return false;
    }
    updatePosition(newRect){
        this.positionComponent.x = newRect.x;
        this.positionComponent.y = newRect.y;
    }
}

module.exports = GameObject;