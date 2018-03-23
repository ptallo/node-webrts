var Section = require('./Section.js');
var GuiItem = require('./GuiItem.js');

class Gui {
    constructor(){
        this.sections = [];
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
        let section = new Section();
        for(let i = 0; i < 18; i++){
            section.addItem(new GuiItem(30, 30, 0.10, 0.10));
        }
        this.sections.push(section);
        this.sections.push(new Section());
        this.sections.push(new Section());
    }
    draw(transform){
        if (typeof window !== 'undefined' && window.document) {
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            
            this.rect.x = -transform.x;
            this.rect.y = -transform.y + (canvas.height * 0.75);
            this.rect.width = canvas.width;
            this.rect.height = (canvas.height * 0.25);
            
            context.fillStyle = "#f500e5";
            context.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            
            for (let i = 0; i < this.sections.length; i++) {
                this.sections[i].draw(this.rect, this.sections.length, i);
            }
        }
    }
}

module.exports = Gui;