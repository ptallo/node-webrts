
class GuiItem{
    constructor(width, height){
        this.rect = {
            x : 0,
            y : 0,
            width : width,
            height : height
        };
    }
    draw(point){
        let canvas = document.getElementById('game_canvas');
        let context = canvas.getContext('2d');
        
        this.rect.x = point.x;
        this.rect.y = point.y;
    
        context.strokeStyle = "#1db8ee";
        context.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}

module.exports = GuiItem;