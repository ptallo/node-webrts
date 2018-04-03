
class ActionComponent {
    constructor(){
        this.type = "ActionComponent";
        this.actions = [];
        this.keys = ['q', 'w', 'e', 'r', 't'];
    }
    addAction(activateFunction){
        this.actions.push(activateFunction);
    }
    activate(keyEvent){
        console.log(keyEvent.key);
        let index = this.keys.indexOf(keyEvent.key);
        console.log(index);
        console.log(this.actions.length);
        if (typeof this.actions[index] === 'function') {
            this.actions[index]();
        }
    }
}

module.exports = ActionComponent;