function Moon(parent, radius, rotationalSpeed, imageName, scale) {
    this.parent = parent;
    this.radius = radius;
    this.rotationalSpeed = rotationalSpeed;
    this.rotation = 0;
    this.x = parent.x + this.radius * Math.cos(this.rotation);
    this.y = parent.y + this.radius * Math.sin(this.rotation);
    this.images = {
        body: { image: new Image() }
    };

    this.images.body.image.src = "Resources/Images/" + imageName;
    this.images.body.scale = scale;

    this.draw = function () {
        ctx.drawImage(this.images.body.image, this.x - this.images.body.scale * this.images.body.image.width / 2, this.y - this.images.body.scale * this.images.body.image.height / 2, this.images.body.scale * this.images.body.image.width, this.images.body.scale * this.images.body.image.height);
    };

    this.move = function () {
        this.rotation += this.rotationalSpeed;
        this.x = parent.x + this.radius * Math.cos(this.rotation);
        this.y = parent.y + this.radius * Math.sin(this.rotation);
    };
}
