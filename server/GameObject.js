'use strict';
var shortid = require('shortid');
var PositionComponent = require('./component/PositionComponent.js');
var SizeComponent = require('./component/SizeComponent.js');
var VelocityComponent = require('./component/VelocityComponent.js');

class GameObject{
    constructor(x, y, width, height){
        this.id = shortid.generate();
        this.sizeComponent = new SizeComponent(width, height);
        this.positionComponent = new PositionComponent(x, y);
        this.velocityComponent = new VelocityComponent();
    }
    update(){
        if(this.velocityComponent.xVelocity != 0){
            this.positionComponent.x += this.velocityComponent.xVelocity;
        }

        if(this.velocityComponent.yVelocity != 0){
            this.positionComponent.y += this.velocityComponent.yVelocity;
        }
    }
}

module.exports = GameObject;