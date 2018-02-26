class Animation {
    constructor(physicsComponent, url, startFrame, totalFrames, frameWidth, frameHeight){
        this.physicsComponent = physicsComponent;
        this.url = url;
        this.image = null;
        this.startFrame = startFrame - 1;
        this.currentFrame = startFrame;
        this.totalFrames = totalFrames;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.timeStamp = Date.now();
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
                this.currentFrame * this.frameWidth,
                0,
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
        let newTimestamp = Date.now();
        if (Math.abs(this.timeStamp - newTimestamp) > 250) {
            if (this.currentFrame < this.startFrame + this.totalFrames - 1) {
                this.currentFrame += 1;
            } else {
                this.currentFrame = this.startFrame;
            }
            this.timeStamp = newTimestamp;
        }
    }
    loadImage(){
        this.image = new Image();
        this.image.src = this.url;
    }
}

module.exports = Animation;