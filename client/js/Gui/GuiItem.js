
class GuiItem{
    constructor(){
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
        this.active = false;
    }
    draw(sectionRect, itemNumber){
        let canvas = document.getElementById('game_canvas');
        let context = canvas.getContext('2d');

        if (itemNumber <= 25) {
            let xNumber = itemNumber % 5;
            let yNumber = Math.floor(itemNumber / 5);

            this.rect.width = sectionRect.width * 0.18;
            this.rect.height = sectionRect.height * 0.18;
            this.rect.x = sectionRect.x + (sectionRect.width * xNumber / 5) + (sectionRect.width * 0.05 / 5);
            this.rect.y = sectionRect.y + (sectionRect.height * yNumber / 5) + (sectionRect.height * 0.05 / 5);

            context.fillStyle = "#1b15ee";
            context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

            this.active = true;
        } else {
            this.active = false;
        }
    }
}

module.exports = GuiItem;