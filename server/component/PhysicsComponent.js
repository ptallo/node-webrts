

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
        this.timeStamp = null;
    }
    update(gameObjects){
        let newRect = this.getNewRect();
        let collision = this.checkCollision(gameObjects, newRect);
        if (!collision) {
            this.updatePhysics(newRect);
        }
    }
    calculateDeltaTime(){
        let lastTimeStamp = this.timeStamp;
        this.timeStamp = Date.now()
        var dt = this.timeStamp - lastTimeStamp;
        return dt;
    }
    updateDestination(x, y){
        this.destX = x;
        this.destY = y;
    }
    getNewRect(){
        let distance = Math.sqrt(Math.pow(this.destX - this.x, 2) + Math.pow(this.destY - this.y, 2));
        let xDistance = Math.abs(this.x - this.destX);
        let yDistance = Math.abs(this.y - this.destY);
    
        let cos = xDistance / distance;
        let sin = yDistance / distance;

        let dt = this.calculateDeltaTime();

        let move = {
            x : this.speed * cos * (1/1000 * dt),
            y : this.speed * sin * (1/1000 * dt)
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
            x : newX,
            y : newY
        }
        
        return newPosRect;
    }
    checkCollision(gameObjects, newRect){
        for (let i = 0; i < gameObjects.length; i++){
            let gameObject = gameObjects[i];
            if (this.id != gameObject.id) {
                if (newRect.x < gameObject.physicsComponent.x + gameObject.physicsComponent.width &&
                    newRect.x + newRect.width > gameObject.physicsComponent.x &&
                    newRect.y < gameObject.physicsComponent.y + gameObject.physicsComponent.height &&
                    newRect.y + newRect.height  > gameObject.physicsComponent.y) {
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