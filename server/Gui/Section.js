
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
    draw(point, numberOfSections){
        //Draw the items for the section then on top of that draw each item
        let canvas = document.getElementById('game_canvas');
        let context = canvas.getContext('2d');
        
        this.rect.x = point.x;
        this.rect.y = point.y;
        this.rect.width = canvas.width / numberOfSections;
        this.rect.height = canvas.height * 0.18;
    
        context.strokeStyle = "#5589a2";
        context.rect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].draw(point);
        }
    }
}

module.exports = Section;