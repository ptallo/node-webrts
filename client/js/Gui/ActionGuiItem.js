var GuiItem = require('./GuiItem.js');

class ActionGuiItem extends GuiItem{
    constructor(width, height, xBuffer, yBuffer, action){
        super(width, height, xBuffer, yBuffer);
        this.action = action;
    }
    activate(mouseDownCoords){
        if (mouseDownCoords.x > this.rect.x &&
            mouseDownCoords.x < this.rect.x + this.rect.width &&
            mouseDownCoords.y > this.rect.y &&
            mouseDownCoords.y < this.rect.y + this.rect.height){
            this.fillStyle = "#FF0000";
            this.action.activate();
        }
    }
}

module.exports = ActionGuiItem;