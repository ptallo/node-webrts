
class RenderComponent {
    constructor(physicsComponent, url, frameWidth, frameHeight, totalAnimations, totalFrames){
        this.image = null;
        this.url = url;
        this.physicsComponent = physicsComponent;
        
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.totalFrames = totalFrames;
        this.currentFrame = 1;
        this.shift = 0;
        this.timeStamp = Date.now();
    }
    draw(){
        let newTime = Date.now();
        if(newTime - this.timeStamp > 250){
            this.animate();
            this.timeStamp = newTime;
        }
        if (typeof window !== 'undefined' && window.document){
            if (this.image === null){
                this.loadImage();
            }
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            //ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            context.drawImage(
                this.image,
                this.shift, //sourceX
                0, //sourceY
                this.frameWidth,
                this.frameHeight,
                this.physicsComponent.x,
                this.physicsComponent.y,
                this.physicsComponent.width,
                this.physicsComponent.height
            );
        }
    }
    loadImage(){
        this.image = new Image();
        this.image.src = this.url;
    }
    animate(){
        if (this.totalFrames > this.currentFrame) {
            this.shift += this.frameWidth;
            this.currentFrame += 1;
        } else {
            this.shift = 0;
            this.currentFrame = 1;
        }
    }
 }
 
 module.exports = RenderComponent;