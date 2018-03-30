var Action = require('./Action.js');

class ActionComponent {
    constructor(){
        this.type = "ActionComponent";
        this.actions = [];
        this.keys = ['q', 'w', 'e', 'r', 't', 'y', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b'];
    }
    addAction(activationFunction){
        let key = this.keys[this.actions.length];
        let action = new Action(activationFunction, key);
        this.actions.push(action);
    }
    getActions(){
        return this.actions;
    }
    activate(keyEvent){
        let index = this.keys.indexOf(keyEvent.key);
        if (index > -1){
            let action = this.actions[index];
            action.activate();
        }
    }
}

module.exports = ActionComponent;