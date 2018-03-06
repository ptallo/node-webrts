var Tile = require('./Tile.js');

class Map{
    constructor(){
        this.tileHeight = 64;
        this.tileWidth = 64;
        this.mapDef = [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 2, 1, 1, 3, 3, 1],
            [1, 2, 2, 1, 3, 3, 1],
            [1, 2, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 1, 1, 1],
            [1, 2, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ];
        this.tileDef = {
            1 : new Tile('images/grasstile.png', true, true),
            2 : new Tile('images/sandtile.png', false, true),
            3 : new Tile('images/swamp.png', false, false)
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
                tile.draw(this.twoDToIso(point));
            }
        }
    }
    isoToTwoD(point){
        let cartoPoint = {};
        cartoPoint.x = (2 * point.x + point.y) / 2;
        cartoPoint.y = (2 * point.y - point.y) / 2;
        return cartoPoint;
    }
    twoDToIso(point){
        let isoPoint = {};
        isoPoint.x = point.x - point.y;
        isoPoint.y = (point.x + point.y) / 2;
        return isoPoint;
    }
    getTileAtPoint(point){

    }
    checkMovable(rect){
        let point = {
            x : rect.x,
            y : rect.y
        };

        let isoPoint = this.twoDToIso(point);
        let tile = this.getTileAtPoint(isoPoint)
    }
}

module.exports = Map;