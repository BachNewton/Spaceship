function Explosion(x, y, xVel, yVel) {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.life = 40;
    new Audio("Resources/Sounds/explosion.wav").play();
    this.images = {
        body: { image: explosionImage }
    };

    this.images.body.scale = 0.025;

    this.draw = function () {
        ctx.drawImage(this.images.body.image, this.x - this.images.body.scale * this.images.body.image.width / 2, this.y - this.images.body.scale * this.images.body.image.height / 2, this.images.body.scale * this.images.body.image.width, this.images.body.scale * this.images.body.image.height);
    }

    this.move = function () {
        this.x += this.xVel;
        this.y += this.yVel;
    };

    this.update = function () {
        this.life--;
        this.images.body.scale *= 1.05;
    };
}
