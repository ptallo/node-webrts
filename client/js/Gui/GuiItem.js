
class GuiItem{
    constructor(width, height, xBuffer, yBuffer){
        this.rect = {
            x : 0,
            y : 0,
            width : width,
            height : height,
            outerWidth : width + width * xBuffer,
            outerHeight : height + height * yBuffer
        };
        this.xBuffer = xBuffer;
        this.yBuffer = yBuffer;
    }
    draw(sectionRect, itemNumber) {
        let canvas = document.getElementById('game_canvas');
        let context = canvas.getContext('2d');
        
        let numberItemsX = Math.floor(sectionRect.width / this.rect.outerWidth);
        
        let xPos = itemNumber % numberItemsX;
        let yPos = Math.floor(itemNumber / numberItemsX);
        
        this.rect.x = sectionRect.x + (xPos * this.rect.outerWidth) + (this.rect.width * this.xBuffer);
        this.rect.y = sectionRect.y + (yPos * this.rect.outerHeight) + (this.rect.height * this.yBuffer);
    
        context.fillStyle = "#1b15ee";
        context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}

module.exports = GuiItem;