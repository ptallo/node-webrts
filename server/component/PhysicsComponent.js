

class PhysicsComponent {
    constructor(id, x, y, width, height, speed){
        this.id = id;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.destX = x;
        this.destY = y;
        this.speed = speed;
    }
    update(tickRate, objects){
        let newRect = this.getNewRect(tickRate);
        let collision = this.checkCollision(objects, newRect);
        if (!collision) {
            this.updatePhysics(newRect);
        }
    }
    updateDestination(x, y){
        this.destX = x;
        this.destY = y;
    }
    getNewRect(tickRate){
        let distance = Math.sqrt(Math.pow(this.destX - this.x, 2) + Math.pow(this.destY - this.y, 2));
        let xDistance = Math.abs(this.x - this.destX);
        let yDistance = Math.abs(this.y - this.destY);
    
        let cos = xDistance / distance;
        let sin = yDistance / distance;
    
        let move = {
            x : this.speed * (1/1000 * tickRate) * cos,
            y : this.speed * (1/1000 * tickRate) * sin
        };
    
        let newX = null;
        if (this.destX != this.x){
            let coeff = this.destX < this.x ? -1 : 1;
            if (Math.abs(this.destX - this.x) < move.x) {
                newX = this.destX;
            } else {
                newX = this.x + move.x * coeff;
            }
        } else {
            newX = this.x;
        }
    
        let newY = null;
        if (this.destY != this.y){
            let coeff = this.destY < this.y ? -1 : 1;
            if (Math.abs(this.destY - this.y) < move.y){
                newY = this.destY;
            } else {
                newY = this.y + move.y * coeff;
            }
        } else {
            newY = this.y;
        }
    
        let newPosRect = {
            width : this.width,
            height : this.height,
            x : Math.floor(newX),
            y : Math.floor(newY)
        }
        
        return newPosRect;
    }
    checkCollision(objects, newRect){
        for (let i = 0; i < objects.length; i++){
            let object = objects[i];
            if (this.id != object.id) {
                if (newRect.x < object.physicsComponent.x + object.physicsComponent.width &&
                    newRect.x + newRect.width > object.physicsComponent.x &&
                    newRect.y < object.physicsComponent.y + object.physicsComponent.height &&
                    newRect.y + newRect.height  > object.physicsComponent.y) {
                    // collision detected!
                    return true;
                }
            }
        }
        return false;
    }
    updatePhysics(newRect){
        this.x = newRect.x;
        this.y = newRect.y;
    }
}

module.exports = PhysicsComponent;