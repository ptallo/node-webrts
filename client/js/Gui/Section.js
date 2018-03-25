
class Section{
    constructor(xBuffer, yBuffer){
        this.items = [];
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
        this.xBuffer = xBuffer;
        this.yBuffer = yBuffer;
    }
    draw(guiRect, numberOfSections, sectionNumber){
        let canvas = document.getElementById('game_canvas');
        let context = canvas.getContext('2d');

        this.rect.width = guiRect.width * (1 - this.xBuffer) / numberOfSections;
        this.rect.height = guiRect.height * (1 - this.yBuffer);
        this.rect.x = guiRect.x + (guiRect.width * sectionNumber / numberOfSections) + (guiRect.width * this.xBuffer / 2 / numberOfSections);
        this.rect.y = guiRect.y + (guiRect.height * this.yBuffer / 2);

        context.fillStyle = "#7b31a2";
        context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].draw(this.rect, i);
        }
    }
    addItem(item){
        this.items.push(item);
    }
    activate(){
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].activate();
        }
    }
}

module.exports = Section;