class Animation {
    constructor(physicsComponent, url, animationNumber, frameWidth, frameHeight, totalFrames){
        this.physicsComponent = physicsComponent;
        this.url = url;
        this.image = null;
        this.shift = 0;
        this.animationNumber = animationNumber - 1;
        this.currentFrame = 1;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.totalFrames = totalFrames;
    }
    draw(){
        if (typeof window !== 'undefined' && window.document){
            if (this.image === null){
                this.loadImage();
            }
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            context.drawImage(
                this.image,
                this.shift,
                this.animationNumber * this.frameHeight,
                this.frameWidth,
                this.frameHeight,
                this.physicsComponent.x,
                this.physicsComponent.y,
                this.physicsComponent.width,
                this.physicsComponent.height
            );
        }
    }
    animate(){
        if (this.currentFrame < this.totalFrames) {
            this.shift += this.frameWidth;
            this.currentFrame += 1;
        } else {
            this.shift = 0;
            this.currentFrame = 1;
        }
    }
    loadImage(){
        this.image = new Image();
        this.image.src = this.url;
    }
}

module.exports = Animation;