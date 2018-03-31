var Section = require('./Section.js');
var ActionGuiItem = require('./ActionGuiItem.js');

class ActionSection extends Section{
    constructor(xBuffer, yBuffer){
        super(xBuffer, yBuffer);
    }
    addItem(gameObject){
        this.items = [];
        for (let action in gameObject.actionComponent.actions){
            let item = new ActionGuiItem(30, 30, 0.10, 0.10, action);
            this.items.push(item);
        }
    }
}

module.exports = ActionSection;