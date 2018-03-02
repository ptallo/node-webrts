var RenderComponent = require('./component/RenderComponent.js');

class Tile {
    constructor(url){
        this.renderComponent = new RenderComponent(url);
    }
    draw(point){
        this.renderComponent.draw(point);
    }
}

module.exports = Tile;