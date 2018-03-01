
class Tile {
    constructor(url, width, height){
        this.url = url;
        this.image = null;
        this.width = width;
        this.height = height;
    }
    drawImage(point){
        if (typeof window !== 'undefined' && window.document) {
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            this.loadImage();
            context.drawImage(
                this.image,
                point.x,
                point.y,
                this.width,
                this.height
            );
        }
    }
    loadImage(){
        if (this.image === null) {
            this.image = new Image();
            this.image.url = this.url;
        }
    }
}

module.exports = Tile;