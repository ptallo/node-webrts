'use strict';
var shortid = require('shortid');

class GameObject{
    constructor(x, y){
        this.id = shortid.generate();
        this.x = x;
        this.y = y;
    }
    draw(){
    
    }
}

module.exports = GameObject;