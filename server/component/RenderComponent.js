var Animation = require('./Animation.js');
var State = require('./State.js');

class RenderComponent {
    constructor(physicsComponent, url){
        this.image = null;
        this.url = url;
        this.physicsComponent = physicsComponent;
        this.animations = [];
        this.currentAnimation = null;
    }
    addAnimation(state, startFrame, totalFrames, frameWidth, frameHeight){
        let animation = new Animation(this.physicsComponent, this.url, startFrame, totalFrames, frameWidth, frameHeight);
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
    draw(){
        this.currentAnimation.animate();
        if (typeof window !== 'undefined' && window.document) {
            if (this.currentAnimation === null) {
                let canvas = document.getElementById('game_canvas');
                let context = canvas.getContext('2d');
                this.loadImage();
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
    loadImage(){
        if (this.image === null) {
            this.image = new Image();
            this.image.url = this.url;
        }
    }
 }
 
 module.exports = RenderComponent;