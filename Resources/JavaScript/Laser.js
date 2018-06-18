function Laser(spaceship) {
    this.x = spaceship.x;
    this.y = spaceship.y;
    this.angle = spaceship.getGunAngle();
    this.xVel = spaceship.xVel + Math.cos(this.angle) * spaceship.laserSpeed;
    this.yVel = spaceship.yVel + Math.sin(this.angle) * spaceship.laserSpeed;
    new Audio("Resources/Sounds/laser.wav").play();
    this.images = {
        laser: spaceship.images.laser
    };

    this.draw = function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.drawImage(this.images.laser.image, 0 - this.images.laser.scale * this.images.laser.image.width / 2, 0 - this.images.laser.scale * this.images.laser.image.height, this.images.laser.scale * this.images.laser.image.width, this.images.laser.scale * this.images.laser.image.height);
        ctx.restore();
    };

    this.move = function () {
        this.x += this.xVel;
        this.y += this.yVel;
    }

    this.getCollisionPoint = function () {
        return {
            x: this.x + this.images.laser.image.height * this.images.laser.scale * Math.cos(this.angle),
            y: this.y + this.images.laser.image.height * this.images.laser.scale * Math.sin(this.angle)
        };
    };

    this.getDistanceTo = function (asteroid) {
        var point = this.getCollisionPoint();
        return Math.hypot(asteroid.y - point.y, asteroid.x - point.x);
    };

    this.collideWith = function (asteroid) {
        return this.getDistanceTo(asteroid) < asteroid.images.body.image.width * asteroid.images.body.scale / 2;
    };
}
