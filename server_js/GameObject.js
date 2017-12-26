'use strict';
var shortid = require('shortid');
var PositionComponent = require('./component/PositionComponent.js');
var SizeComponent = require('./component/SizeComponent.js');

class GameObject{
    constructor(x, y, width, height){
        this.id = shortid.generate();
        this.positionComponent = new PositionComponent(x, y);
        this.sizeComponent = new SizeComponent(width, height);
    }
    update(){
    
    }
}

module.exports = GameObject;