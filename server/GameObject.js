var shortid = require('shortid');
var CirclePhysicsComponent = require('./component/CirclePhysicsComponent.js');
var RenderComponent = require('./component/RenderComponent.js');
var State = require('./component/State.js');

class GameObject{
    constructor(x, y, radius, xDisjoint, yDisjoint, url){
        this.type = "GameObject";
        this.id = shortid.generate();
        this.state = State.IDLE;
        this.disjoint = {
            x : xDisjoint,
            y : yDisjoint
        };
        this.physicsComponent = new CirclePhysicsComponent(this.id, x, y, radius, 100);
        this.renderComponent = new RenderComponent(url);
        this.renderComponent.addAnimation(State.IDLE, 2, 4, 32, 32);
        this.renderComponent.addAnimation(State.WALKING, 6, 4, 32, 32);
    }
    update(gameObjects, map){
        let newState = this.determineState();
        if (this.state !== newState){
            this.setState(newState);
        }

        this.physicsComponent.update(gameObjects, map);
        this.physicsComponent.drawCollisionSize();
        let renderPoint = {
            x : this.physicsComponent.circle.x - this.disjoint.x,
            y : this.physicsComponent.circle.y - this.disjoint.y
        };
        this.renderComponent.draw(renderPoint);
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
        if (this.physicsComponent.destPoint.x !== this.physicsComponent.circle.x || this.physicsComponent.destPoint.y !== this.physicsComponent.circle.y) {
            state = State.WALKING;
        }
        return state;
    }
}

module.exports = GameObject;