var RenderComponent = require('./component/RenderComponent.js');
var ActionComponent = require('./component/ActionComponent.js');

class Building {
    constructor(rect, url){
        this.rect = rect;
        this.renderComponent = new RenderComponent(url);
        this.actionComponent = new ActionComponent();
    }
}