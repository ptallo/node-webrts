'use strict';
var shortid = require('shortid');
var RenderComponent = require('./component/RenderComponent.js');

class GameObject{
    constructor(x, y){
        this.id = shortid.generate();
        this.renderComponent = new RenderComponent();
    }
    update(){
    
    }
}

module.exports = GameObject;