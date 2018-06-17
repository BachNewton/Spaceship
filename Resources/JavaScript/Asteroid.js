function Asteroid(x, y, xVel, yVel, size, rotationalSpeed) {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.grid = ROOT_GRID.getGrid(this.x, this.y);
    this.grid.objects.asteroids.push(this);
    this.size = size;
    this.rotation = 0;
    this.rotationalSpeed = rotationalSpeed;
    this.images = {
        body: { image: asteroidImage }
    };

    this.images.body.scale = this.size;

    this.draw = function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.images.body.image, 0 - this.images.body.scale * this.images.body.image.width / 2, 0 - this.images.body.scale * this.images.body.image.height / 2, this.images.body.scale * this.images.body.image.width, this.images.body.scale * this.images.body.image.height);
        ctx.restore();
    };

    this.drawHitBox = function () {
        ctx.fillStyle = this.grid.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.images.body.image.width * this.images.body.scale / 2, 0, 2 * Math.PI);
        ctx.fill();
    };

    this.mark = function () {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 25;
        ctx.beginPath();
        ctx.moveTo(this.x - this.images.body.image.width * this.images.body.scale / 2, this.y - this.images.body.image.height * this.images.body.scale / 2);
        ctx.lineTo(this.x + this.images.body.image.width * this.images.body.scale / 2, this.y + this.images.body.image.height * this.images.body.scale / 2);
        ctx.moveTo(this.x + this.images.body.image.width * this.images.body.scale / 2, this.y - this.images.body.image.height * this.images.body.scale / 2);
        ctx.lineTo(this.x - this.images.body.image.width * this.images.body.scale / 2, this.y + this.images.body.image.height * this.images.body.scale / 2);
        ctx.stroke();
    };

    this.move = function () {
        this.rotation += this.rotationalSpeed;
        this.moveTo(this.x + this.xVel, this.y + this.yVel);
    };

    this.moveTo = function (x, y) {
        var newGrid = ROOT_GRID.getGrid(x, y);

        if (this.grid != newGrid) {
            var index = this.grid.objects.asteroids.indexOf(this);
            this.grid.objects.asteroids.splice(index, 1);
            newGrid.objects.asteroids.push(this);
            this.grid = newGrid;
        }

        this.x = x;
        this.y = y;
    };
}
