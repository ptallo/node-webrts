
class RenderComponent {
    constructor(url, physicsComponent){
        this.url = url;
        this.physicsComponent = physicsComponent;
    }
    draw(){
        if (typeof window !== 'undefined' && window.document){
            var image = new Image();
            image.src = this.url;
            let canvas = document.getElementById('game_canvas');
            let context = canvas.getContext('2d');
            context.drawImage(
                image,
                this.physicsComponent.x,
                this.physicsComponent.y,
                this.physicsComponent.width,
                this.physicsComponent.height
            );
        }
    }
}

module.exports = RenderComponent;