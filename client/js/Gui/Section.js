
class Section{
    constructor(){
        this.items = [];
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
    }
    draw(guiRect, numberOfSections, sectionNumber){
        let canvas = document.getElementById('game_canvas');
        let context = canvas.getContext('2d');

        this.rect.width = guiRect.width * 0.95 / numberOfSections;
        this.rect.height = guiRect.height * 0.90;
        this.rect.x = guiRect.x + (guiRect.width * sectionNumber / numberOfSections) + (guiRect.width * 0.025 / numberOfSections);
        this.rect.y = guiRect.y + (guiRect.height * 0.05);

        context.fillStyle = "#7b31a2";
        context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].draw(this.rect, i);
        }
    }
    addItem(item){
        this.items.push(item);
    }
}

module.exports = Section;