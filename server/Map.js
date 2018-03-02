var Tile = require('./Tile.js');

class Map{
    constructor(){
        this.tileHeight = 32;
        this.tileWidth = 32;
        this.mapDef = [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ];
        this.tileDef = {
            1 : new Tile('images/basetile2.png')
        }
    }
    drawMap(){
        for(let i = 0; i < this.mapDef.length; i++){
            for(let j = 0; j < this.mapDef[i].length; j++){
                let point = {};
                point.x = j * this.tileWidth;
                point.y = i * this.tileHeight;
                let tileType = this.mapDef[i][j];
                let tile = this.tileDef[tileType];
                tile.draw(this.cartToIso(point));
            }
        }
    }
    isoToCart(point){
        let cartoPoint = {};
        cartoPoint.x = (2 * point.x + point.y) / 2;
        cartoPoint.y = (2 * point.y - point.y) / 2;
        return cartoPoint;
    }
    cartToIso(point){
        let isoPoint = {};
        isoPoint.x = point.x - point.y;
        isoPoint.y = (point.x + point.y) / 2;
        return isoPoint;
    }
}

module.exports = Map;