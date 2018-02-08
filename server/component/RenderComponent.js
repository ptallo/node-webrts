var Animation = require('./Animation.js');
var State = require('./State.js');

class RenderComponent {
    constructor(physicsComponent, url){
        this.image = null;
        this.url = url;
        this.physicsComponent = physicsComponent;
        this.animations = [];
        this.currentAnimation = null;
        this.timeStamp = Date.now();
    }
    addAnimation(state, frameWidth, frameHeight, animationNumber, totalFrames){
        let animation = new Animation(this.physicsComponent, this.url, animationNumber, frameWidth, frameHeight, totalFrames, 3000);
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
                    this.currentAnimation.currentFrame = 1;
                    this.currentAnimation.shift = 0;
                }
                this.currentAnimation = this.animations[i].value;
            }
        }
    }
    draw(){
        this.animate();
        if (typeof window !== 'undefined' && window.document) {
            if (this.currentAnimation === null) {
                let canvas = document.getElementById('game_canvas');
                let context = canvas.getContext('2d');
                this.image = new Image();
                this.image.url = this.url;
                context.drawImage(
                    this.image,
                    this.physicsComponent.x,
                    this.physicsComponent.y,
                    this.physicsComponent.width,
                    this.physicsComponent.height
                );
            } else {
                this.currentAnimation.draw();
            }
        }
    }
    animate(){
        this.currentAnimation.animate();
    }
 }
 
 module.exports = RenderComponent;