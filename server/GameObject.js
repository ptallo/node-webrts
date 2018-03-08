'use strict';
var shortid = require('shortid');
var PhysicsComponent = require('./component/PhysicsComponent.js');
var RenderComponent = require('./component/RenderComponent.js');
var State = require('./component/State.js');

class GameObject{
    constructor(x, y, radius){
        this.id = shortid.generate();
        this.state = State.IDLE;
        this.physicsComponent = new PhysicsComponent(this.id, x, y, radius, 100);
        this.renderComponent = new RenderComponent('images/character.png');
        this.renderComponent.addAnimation(State.IDLE, 2, 4, 32, 32);
        this.renderComponent.addAnimation(State.WALKING, 6, 4, 32, 32);
    }
    update(gameObjects, map){
        let newState = this.determineState();
        if (this.state !== newState){
            this.setState(newState);
        }

        this.physicsComponent.update(gameObjects, map);

        let point = {};
        point.x = this.physicsComponent.x;
        point.y = this.physicsComponent.y;
        this.renderComponent.draw(point);
    }
    updateDestination(x, y){
        this.physicsComponent.updateDestination(x, y);
    }
    setState(state){
        this.state = state;
        this.renderComponent.changeState(state);
    }
    determineState(){
        let state = State.IDLE;
        if (this.physicsComponent.destX !== this.physicsComponent.x || this.physicsComponent.destY !== this.physicsComponent.y) {
            state = State.WALKING;
        }
        return state;
    }
}

module.exports = GameObject;