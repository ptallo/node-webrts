var Utility = require('../Utility.js');

class RectPhysicsComponent {
    constructor(id, x, y, width, height, speed){
        this.type = "RectPhysicsComponent";
        this.id = id;
        this.speed = speed;
        this.timeStamp = null;
        this.destPoint = {
            x : x,
            y : y
        };
        this.rect = {
            x : x,
            y : y,
            width : width,
            height : height
        };
    }
    update(gameObjects, map){
        let newRect = this.getNewRect();
        let collision = this.checkCollision(gameObjects, newRect);
        let rectList = map.getUnmovableMapRects();
        for (let i = 0; i < rectList.length; i++){
            let tempCollision = Utility.checkRectRectCollision(rectList[i], newRect);
            if (tempCollision){
                collision = true;
            }
        }
        
        let point = {
            x : this.rect.x + this.rect.width / 2,
            y : this.rect.y + this.rect.height / 2
        };
        let inMap = point.x > map.rect.x &&
            point.x < map.rect.x + map.rect.width &&
            point.y > map.rect.y &&
            point.y < map.rect.y + map.rect.height;
        
        if (!collision && inMap){
            this.rect = newRect;
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
    getNewRect(){
        let dx = Math.abs(this.rect.x - this.destPoint.x);
        let dy = Math.abs(this.rect.y - this.destPoint.y);
        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    
        let cos = dx / distance;
        let sin = dy / distance;
    
        let dt = this.calculateDeltaTime();
    
        let move = {
            x : this.speed * cos * (1/1000 * dt),
            y : this.speed * sin * (1/1000 * dt)
        };
    
        let newX = null;
        if (this.destPoint.x !== this.rect.x){
            let coefficient = this.destPoint.x < this.rect.x ? -1 : 1;
            if (Math.abs(this.destPoint.x - this.rect.x) < move.x) {
                newX = this.destPoint.x ;
            } else {
                newX = this.rect.x + move.x * coefficient;
            }
        } else {
            newX = this.rect.x;
        }
    
        let newY = null;
        if (this.destPoint.y !== this.rect.y){
            let coefficient = this.destPoint.y < this.rect.y ? -1 : 1;
            if (Math.abs(this.destPoint.y - this.rect.y) < move.y){
                newY = this.destPoint.y ;
            } else {
                newY = this.rect.y + move.y * coefficient;
            }
        } else {
            newY = this.rect.y;
        }
        
        let newRect = {
            x : newX,
            y : newY,
            width: this.rect.width,
            height : this.rect.height
        };
        
        return newRect;
    }
    checkCollision(gameObjects, newRect){
        for (let i = 0; i < gameObjects.length; i++) {
            if (gameObjects[i].id !== this.id){
                let collision = false;
                if (Object.keys(gameObjects[i].physicsComponent).indexOf("circle") > -1) {
                    collision = Utility.checkRectCircleCollision(newRect, gameObjects[i].physicsComponent.circle);
                } else if (Object.keys(gameObjects[i].physicsComponent).indexOf('rect') > -1){
                    collision = Utility.checkRectRectCollision(gameObjects[i].physicsComponent.rect, newRect);
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
            context.strokeRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        }
    }
    setPosition(x, y){
        this.rect.x = x;
        this.rect.y = y;
    }
}

module.exports = RectPhysicsComponent;