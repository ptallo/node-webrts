var Utility = require('../Utility.js');

class CirclePhysicsComponent {
    constructor(id, x, y, radius, speed){
        this.type = "CirclePhysicsComponent";
        this.id = id;
        this.circle = {
            x : x,
            y : y,
            radius : radius
        };
        this.destPoint = {
            x : x,
            y : y
        };
        this.speed = speed;
        this.timeStamp = null;
    }
    update(gameObjects, map){
        let newCircle = this.getNewCircle();
        let collision = this.checkCollision(gameObjects, newCircle);
        let rectList = map.getUnmovableMapRects();
        for (let i = 0; i < rectList.length; i++){
            let tempCollision = Utility.checkCircleRectCollision(rectList[i], newCircle);
            if (tempCollision) {
                collision = true;
            }
        }
        if (!collision) {
            this.circle = newCircle;
        }
    }
    calculateDeltaTime(){
        let lastTimeStamp = this.timeStamp;
        this.timeStamp = Date.now();
        var dt = this.timeStamp - lastTimeStamp;
        return dt;
    }
    updateDestination(x, y){
        if (this.speed > 0) {
            this.destPoint = {
                x: x,
                y: y
            }
        }
    }
    getNewCircle(){
        let dx = Math.abs(this.circle.x - this.destPoint.x);
        let dy = Math.abs(this.circle.y - this.destPoint.y);
        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        let cos = dx / distance;
        let sin = dy / distance;

        let dt = this.calculateDeltaTime();

        let move = {
            x : this.speed * cos * (1/1000 * dt),
            y : this.speed * sin * (1/1000 * dt)
        };
    
        let newX = null;
        if (this.destPoint.x !== this.circle.x){
            let coefficient = this.destPoint.x < this.circle.x ? -1 : 1;
            if (Math.abs(this.destPoint.x - this.circle.x) < move.x) {
                newX = this.destPoint.x ;
            } else {
                newX = this.circle.x + move.x * coefficient;
            }
        } else {
            newX = this.circle.x;
        }
    
        let newY = null;
        if (this.destPoint.y !== this.circle.y){
            let coefficient = this.destPoint.y < this.circle.y ? -1 : 1;
            if (Math.abs(this.destPoint.y - this.circle.y) < move.y){
                newY = this.destPoint.y ;
            } else {
                newY = this.circle.y + move.y * coefficient;
            }
        } else {
            newY = this.circle.y;
        }
    
        let newCircle = {
            x : newX,
            y : newY,
            radius : this.circle.radius
        };
        
        return newCircle;
    }
    checkCollision(gameObjects, newCircle){
        for (let i = 0; i < gameObjects.length; i++){
            if (this.id !== gameObjects[i].id) {
                let collision = false;
                if (Object.keys(gameObjects[i].physicsComponent).indexOf('circle') > -1){
                     collision = Utility.checkCircleCircleCollision(gameObjects[i].physicsComponent.circle, newCircle);
                } else if (Object.keys(gameObjects[i].physicsComponent).indexOf('rect') > -1){
                    collision = Utility.checkCircleRectCollision(gameObjects[i].physicsComponent.rect, newCircle);
                }
                
                if (collision){
                    return collision;
                }
            }
        }
        return false;
    }
    drawCollisionSize(){
        if (typeof window !== 'undefined' && window.document){
            let canvas = document.getElementById("game_canvas");
            let context = canvas .getContext("2d");
            context.strokeStyle = "#ffdb39";
            context.beginPath();
            let point = {
                x : this.circle.x,
                y : this.circle.y
            };
            context.ellipse(point.x, point.y, this.circle.radius, 0.5 * this.circle.radius, 0, 0, 2 * Math.PI);
            context.stroke();
        }
    }
}

module.exports = CirclePhysicsComponent;