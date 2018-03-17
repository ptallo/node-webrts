var Tile = require('./Tile.js');
var Utility = require('./Util.js');

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
                tile.draw(point);
            }
        }
    }
    getTileAtPoint(point){
        let tile = null;
        for (let i = 0; i < this.mapDef.length; i++) {
            for (let j = 0; j < this.mapDef[i].length; j++){
                let mapPoint = {};
                mapPoint.x = j * this.tileWidth;
                mapPoint.y = i * this.tileHeight;
                
                if (mapPoint.x < point.x
                    && mapPoint.x + this.tileWidth > point.x
                    && mapPoint.y < point.y
                    && mapPoint.y + this.tileHeight > point.y) {
                    let tileType = this.mapDef[i][j];
                    tile = this.tileDef[tileType];
                }
            }
        }
        return tile;
    }
}

module.exports = Map;