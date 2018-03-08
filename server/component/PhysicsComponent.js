

class PhysicsComponent {
    constructor(id, x, y, radius, speed){
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
        this.destPoint = {
            x : x,
            y : y
        }
    }
    getNewCircle(){
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
        if (this.destPoint.x !== this.x){
            let coeff = this.destPoint.x < this.x ? -1 : 1;
            if (Math.abs(this.destPoint.x - this.x) < move.x) {
                newX = this.destPoint.x ;
            } else {
                newX = this.x + move.x * coeff;
            }
        } else {
            newX = this.x;
        }
    
        let newY = null;
        if (this.destPoint.y !== this.y){
            let coeff = this.destPoint.y < this.y ? -1 : 1;
            if (Math.abs(this.destPoint.y - this.y) < move.y){
                newY = this.destPoint.y ;
            } else {
                newY = this.y + move.y * coeff;
            }
        } else {
            newY = this.y;
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
            let gameObject = gameObjects[i];
            if (this.id != gameObject.id) {
                var dx = gameObject[i].circle.x - newCircle.x;
                var dy = gameObject[i].circle.y - newCircle.y;
                var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy, 2));
                if (distance < newCircle.radius + gameObject[i].circle.radius) {
                    // collision detected!
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = PhysicsComponent;