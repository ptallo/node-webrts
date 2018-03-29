var Animation = require('./Animation.js');
var State = require('./State.js');

class RenderComponent {
    constructor(url){
        this.type = "RenderComponent";
        this.image = null;
        this.url = url;
        this.animations = [];
        this.currentAnimation = null;
    }
    addAnimation(state, startFrame, totalFrames, frameWidth, frameHeight){
        let animation = new Animation(this.url, startFrame, totalFrames, frameWidth, frameHeight);
        let animationDictEntry = {
            key : state,
            value : animation
        };
        if (this.animations.length === 0){
            this.currentAnimation = animation;
        }
        this.animations.push(animationDictEntry);
    }
    changeState(state){
        for(let i = 0; i < this.animations.length; i++){
            if (this.animations[i].key === state){
                if (this.currentAnimation !== null){
                    this.currentAnimation.currentFrame = this.currentAnimation.startFrame;
                }
                this.currentAnimation = this.animations[i].value;
                this.currentAnimation.changedAnimation = true;
            }
        }
    }
    draw(point){
        if (this.currentAnimation !== null) {
            this.currentAnimation.animate();
        }
        if (typeof window !== 'undefined' && window.document) {
            if (this.currentAnimation === null) {
                this.loadImage();
                let canvas = document.getElementById('game_canvas');
                let context = canvas.getContext('2d');
                context.drawImage(
                    this.image,
                    point.x,
                    point.y
                );
            } else {
                this.currentAnimation.draw(point);
            }
        }
    }
    loadImage(){
        this.image = new Image();
        this.image.src = this.url;
    }
 }
 
 module.exports = RenderComponent;