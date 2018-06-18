function Planet(x, y, imageName, scale) {
    this.x = x;
    this.y = y;
    this.images = {
        body: { image: new Image() }
    };

    this.images.body.image.src = "Resources/Images/" + imageName;
    this.images.body.scale = scale;

    this.draw = function () {
        ctx.drawImage(this.images.body.image, this.x - this.images.body.scale * this.images.body.image.width / 2, this.y - this.images.body.scale * this.images.body.image.height / 2, this.images.body.scale * this.images.body.image.width, this.images.body.scale * this.images.body.image.height);
    };
}
