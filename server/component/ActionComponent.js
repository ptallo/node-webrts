var Action = require('./Action.js');

class ActionComponent {
    constructor(){
        this.actions = [];
    }
    addAction(action){
        this.actions.push(action);
    }
}

module.exports = ActionComponent;