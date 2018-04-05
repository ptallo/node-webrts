var Section = require('./Section.js');

var Unit = require('../../../server/gameObjects/Unit.js');
var Building = require('../../../server/gameObjects/Building.js');

var actionPriority = ["Unit", "Building"];

class Gui {
    constructor(){
        this.sections = [];
        this.rect = {
            x : 0,
            y : 0,
            width : 0,
            height : 0
        };
        this.actionSection = new Section(0.05, 0.1);
        this.sections.push(this.actionSection);
        
        this.objectSection = new Section(0, 0);
        this.sections.push(this.objectSection);
        
        this.minimapSection = new Section(0.05, 0.1);
        this.sections.push(this.minimapSection);
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
    activate(mouseDownCoords){
        for (let i = 0; i < this.sections.length; i++){
            this.sections[i].activate(mouseDownCoords);
        }
    }
    deactivate(){
        for (let i = 0; i < this.sections.length; i++) {
            this.sections[i].deactivate();
        }
    }
    populate(gameObjects){
        if (gameObjects.length === 0){
        
        } else {
            //populate actionSection with available actions on selected unit
            //populate objectSection with gameObjects list
            //populate mini map with gameObjects list
        }
    }
}

module.exports = Gui;