
class Action{
    constructor(activationFunction, key){
        this.type = "Action";
        this.activationFunction = activationFunction;
        this.key = key;
    }
    activate(){
        this.activationFunction();
    }
}

module.exports = Action;