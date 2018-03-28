var RenderComponent = require('./component/RenderComponent.js');

class Tile {
    constructor(url, movable, buildable){
        this.type = "Tile";
        this.renderComponent = new RenderComponent(url);
        this.isMovable = movable;
        this.isBuildable = buildable;
    }
    draw(point){
        this.renderComponent.draw(point);
    }
}

module.exports = Tile;