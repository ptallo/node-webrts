
class VelocityComponent{
    constructor(){
        this.xVelocity = 0;
        this.yVelocity = 0;
    }
    updateVelocity(x = 0, y = 0){
        this.xVelocity = x;
        this.yVelocity = y;
    }
}

module.exports = VelocityComponent;