var Section = require('./Section.js');

class Gui {
    constructor(){
        this.sections = [];
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
    }
    draw(transform){
        if (typeof window !== 'undefined' && window.document) {
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            
            this.rect.x = transform.x;
            this.rect.y = transform.y + (canvas.width * 0.80);
            this.rect.width = canvas.width;
            this.rect.height = (canvas.height * 0.20);
            
            console.log('drawing: ' + JSON.stringify(this.rect));
            context.strokeStyle = "#35384d";
            context.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
            
            // for (let i = 0; i < this.sections.length; i++) {
            //     this.sections[i].draw(transform, this.sections.length);
            // }
        }
        
    }
}

module.exports = Gui;