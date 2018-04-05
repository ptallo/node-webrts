
class Utility {
    static checkRectRectCollision(rect1, rect2){
        return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y;
    }
    static checkCircleRectCollision(rect, circle){
        let DeltaX = circle.x - Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
        let DeltaY = circle.y - Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));
        return (DeltaX * DeltaX + DeltaY * DeltaY) < (circle.radius * circle.radius);
    }
    static checkCircleCircleCollision(circle1, circle2) {
        let dx = circle1.x - circle2.x;
        let dy = circle1.y - circle2.y;
        let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        return distance < circle1.radius + circle2.radius;
    }
}

module.exports = Utility;