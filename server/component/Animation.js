class Animation {
    constructor(url, startFrame, totalFrames, frameWidth, frameHeight){
        this.type = "Animation";
        this.url = url;
        this.image = null;
        this.startFrame = startFrame - 1;
        this.currentFrame = startFrame;
        this.totalFrames = totalFrames;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.timeStamp = Date.now();
        this.changedAnimation = false; // this is a boolean which will supercede the 250ms timer between animations
    }
    draw(point){
        if (typeof window !== 'undefined' && window.document){
            this.loadImage();
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            context.drawImage(
                this.image,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.frameHeight,
                point.x,
                point.y,
                this.frameWidth,
                this.frameHeight
            );
        }
    }
    animate(){
        let newTimestamp = Date.now();
        if (Math.abs(this.timeStamp - newTimestamp) > 250 || this.changedAnimation) {
            if (this.currentFrame < this.startFrame + this.totalFrames - 1) {
                this.currentFrame += 1;
            } else {
                this.currentFrame = this.startFrame;
            }
            this.timeStamp = newTimestamp;
            if (this.changedAnimation){
                this.changedAnimation = false;
            }
        }
    }
    loadImage(){
        this.image = new Image();
        this.image.src = this.url;
    }
}

module.exports = Animation;