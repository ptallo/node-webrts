

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
            let gameObject = gameObjects[i];
            if (this.id !== gameObject.id) {
                let dx = gameObject.physicsComponent.circle.x - newCircle.x;
                let dy = gameObject.physicsComponent.circle.y - newCircle.y;
                let distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy, 2));
                if (distance < newCircle.radius + gameObject.physicsComponent.circle.radius) {
                    // collision detected!
                    return true;
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
            context.arc(this.circle.x, this.circle.y, this.circle.radius, 0, 2 * Math.PI);
            context.stroke();
        }
    }
}

module.exports = PhysicsComponent;