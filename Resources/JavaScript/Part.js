function Part(x, y, xVel, yVel, angle) {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.angle = angle;
    this.grid = ROOT_GRID.getGrid(this.x, this.y);
    this.grid.objects.parts.push(this);
    this.images = {
        body: { image: partImage }
    };

    this.images.body.scale = 0.2;

    this.draw = function () {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.drawImage(this.images.body.image, 0 - this.images.body.scale * this.images.body.image.width / 2, 0 - this.images.body.scale * this.images.body.image.height / 2, this.images.body.scale * this.images.body.image.width, this.images.body.scale * this.images.body.image.height);
        ctx.restore();
    };

    this.drawHitBox = function () {
        ctx.fillStyle = this.grid.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.images.body.image.height * this.images.body.scale / 2, 0, 2 * Math.PI);
        ctx.fill();
    };

    this.move = function () {
        this.moveTo(this.x + this.xVel, this.y + this.yVel);
    };

    this.moveTo = function (x, y) {
        var newGrid = ROOT_GRID.getGrid(x, y);

        if (this.grid != newGrid) {
            var index = this.grid.objects.parts.indexOf(this);
            this.grid.objects.parts.splice(index, 1);
            newGrid.objects.parts.push(this);
            this.grid = newGrid;
        }

        this.x = x;
        this.y = y;
    };
}
