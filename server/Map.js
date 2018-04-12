var Tile = require('./Tile.js');

class Map{
    constructor(){
        this.type = "Map";
        this.tileHeight = 64;
        this.tileWidth = 64;
        this.mapDef = [
            [1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 3, 1],
            [1, 1, 2, 1, 1, 3, 1],
            [1, 1, 1, 1, 1, 1, 1],
            [1, 2, 1, 1, 1, 1, 1],
            [1, 2, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1]
        ];
        this.tileDef = {
            1 : new Tile('images/grasstile.png', true, true),
            2 : new Tile('images/sandtile.png', false, true),
            3 : new Tile('images/swamp.png', false, false)
        };
        this.rect = {
            x : 0,
            y : 0,
            width : this.mapDef[0].length * this.tileWidth,
            height : this.mapDef.length * this.tileHeight
        };
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
    getUnmovableMapRects(){
        let rectList = [];
        for (let i = 0; i < this.mapDef.length; i++) {
            for (let j = 0; j < this.mapDef[i].length; j++){
                let tileType = this.mapDef[i][j];
                let tile = this.tileDef[tileType];
                if (!tile.isMovable) {
                    let tileRect = {
                        x : j * this.tileWidth,
                        y : i * this.tileHeight,
                        width : this.tileWidth,
                        height : this.tileHeight
                    };
                    rectList.push(tileRect);
                }
            }
        }
        return rectList;
    }

}

module.exports = Map;