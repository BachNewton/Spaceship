function Spaceship() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.xVel = 0;
    this.yVel = 0;
    this.thrust = 0.25;
    this.parts = 0;
    this.laserSpeed = 25;
    this.laserCooldown = 0;
    this.laserCooldownFilled = 15;
    this.blockCooldown = 0;
    this.blockCooldownFilled = 30;
    this.hitPoints = 10;
    this.invicibilityFrames = 0;
    this.visable = true;
    this.visableCounter = 0;
    this.rcsUp = false;
    this.rcsLeft = false;
    this.rcsDown = false;
    this.rcsRight = false;
    this.rcsSound = new Audio("Resources/Sounds/rcs.wav");
    this.images = {
        body: { image: new Image() },
        rcs: { image: new Image() },
        gun: { image: new Image() },
        laser: { image: new Image() },
        heart: { image: new Image() },
        block: { image: new Image() }
    };

    this.images.body.image.src = "Resources/Images/spaceship.png";
    this.images.body.scale = 0.2;

    this.images.rcs.image.src = "Resources/Images/rcs.png";
    this.images.rcs.scale = 0.2;

    this.images.gun.image.src = "Resources/Images/gun.png";
    this.images.gun.scale = 0.15;

    this.images.laser.image.src = "Resources/Images/laser.jpg";
    this.images.laser.scale = 0.5;

    this.images.heart.image.src = "Resources/Images/heart.png";
    this.images.heart.scale = 0.04;

    this.images.block.image.src = "Resources/Images/block.jpg";
    this.images.block.scale = 0.25;

    this.draw = function () {
        if (this.visable) {
            if (this.rcsUp) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.drawImage(this.images.rcs.image, 0 - this.images.rcs.scale * this.images.rcs.image.width / 2, 0 - this.images.rcs.scale * this.images.rcs.image.height, this.images.rcs.scale * this.images.rcs.image.width, this.images.rcs.scale * this.images.rcs.image.height);
                ctx.restore();
            }

            if (this.rcsRight) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI / 2);
                ctx.drawImage(this.images.rcs.image, 0 - this.images.rcs.scale * this.images.rcs.image.width / 2, 0 - this.images.rcs.scale * this.images.rcs.image.height, this.images.rcs.scale * this.images.rcs.image.width, this.images.rcs.scale * this.images.rcs.image.height);
                ctx.restore();
            }

            if (this.rcsDown) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI);
                ctx.drawImage(this.images.rcs.image, 0 - this.images.rcs.scale * this.images.rcs.image.width / 2, 0 - this.images.rcs.scale * this.images.rcs.image.height, this.images.rcs.scale * this.images.rcs.image.width, this.images.rcs.scale * this.images.rcs.image.height);
                ctx.restore();
            }

            if (this.rcsLeft) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(Math.PI * 3 / 2);
                ctx.drawImage(this.images.rcs.image, 0 - this.images.rcs.scale * this.images.rcs.image.width / 2, 0 - this.images.rcs.scale * this.images.rcs.image.height, this.images.rcs.scale * this.images.rcs.image.width, this.images.rcs.scale * this.images.rcs.image.height);
                ctx.restore();
            }

            ctx.drawImage(this.images.body.image, this.x - this.images.body.scale * this.images.body.image.width / 2, this.y - this.images.body.scale * this.images.body.image.height / 2, this.images.body.scale * this.images.body.image.width, this.images.body.scale * this.images.body.image.height);

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.getGunAngle() + Math.PI / 2);
            ctx.drawImage(this.images.gun.image, 0 - this.images.gun.scale * this.images.gun.image.width / 2, 0 - this.images.gun.scale * this.images.gun.image.height, this.images.gun.scale * this.images.gun.image.width, this.images.gun.scale * this.images.gun.image.height);
            ctx.restore();
        }
    };

    this.drawHearts = function () {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        for (var i = 0; i < this.hitPoints; i++) {
            ctx.drawImage(this.images.heart.image, canvas.width - this.images.heart.image.width * this.images.heart.scale * (i + 1), canvas.height - this.images.heart.image.height * this.images.heart.scale, this.images.heart.image.width * this.images.heart.scale, this.images.heart.image.height * this.images.heart.scale);
        }

        ctx.restore();
    };

    this.drawHitBox = function () {
        var grid = ROOT_GRID.getGrid(this.x, this.y);
        ctx.fillStyle = grid.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.images.body.image.height * this.images.body.scale / 2, 0, 2 * Math.PI);
        ctx.fill();
    };

    this.hit = function () {
        if (this.invicibilityFrames <= 0) {
            this.hitPoints--;
            this.invicibilityFrames = 180;
            explosions.push(new Explosion(this.x, this.y, this.xVel, this.yVel));
        }
    };

    this.pickUpPart = function () {
        this.parts++;
        new Audio("Resources/Sounds/pickUpPart.wav").play();
    };

    this.update = function () {
        this.laserCooldown--;
        this.blockCooldown--;
        this.invicibilityFrames--;

        if (this.invicibilityFrames > 0) {
            this.visableCounter++;
            if (this.visableCounter >= 15) {
                this.visable = !this.visable;
                this.visableCounter = 0;
            }
        } else {
            this.visable = true;
        }

        // if (this.rcsLeft || this.rcsRight || this.rcsUp || this.rcsDown) {
        //     if (this.rcsSound.paused) {
        //         this.rcsSound.play();
        //     } else if (this.rcsSound.currentTime >= 0.4) {
        //         this.rcsSound.currentTime = 0;
        //     }
        // }

        // W
        if (keysHeld[87]) {
            this.thrustUp();
        } else {
            this.thrustUpStop();
        }

        // A
        if (keysHeld[65]) {
            this.thrustLeft();
        } else {
            this.thrustLeftStop();
        }

        // S
        if (keysHeld[83]) {
            this.thrustDown();
        } else {
            this.thrustDownStop();
        }

        // D
        if (keysHeld[68]) {
            this.thrustRight();
        } else {
            this.thrustRightStop();
        }

        // F
        if (keysHeld[70]) {
            if (this.blockCooldown <= 0 && this.parts > 0) {
                new Audio("Resources/Sounds/dropBlock.wav").play();
                this.parts--;
                blocks.push(new Block(this.x, this.y, this.xVel, this.yVel));
                this.blockCooldown = this.blockCooldownFilled;
            }
        }

        // Mouse Held
        if (mouseHeld) {
            if (this.laserCooldown <= 0) {
                lasers.push(new Laser(this));
                this.laserCooldown = this.laserCooldownFilled;
            }
        }
    };

    this.thrustUp = function () {
        this.yVel -= this.thrust;
        this.rcsDown = true;
    };

    this.thrustUpStop = function () {
        this.rcsDown = false;
    };

    this.thrustLeft = function () {
        this.xVel -= this.thrust;
        this.rcsRight = true;
    };

    this.thrustLeftStop = function () {
        this.rcsRight = false;
    };

    this.thrustDown = function () {
        this.yVel += this.thrust;
        this.rcsUp = true;
    };

    this.thrustDownStop = function () {
        this.rcsUp = false;
    };

    this.thrustRight = function () {
        this.xVel += this.thrust;
        this.rcsLeft = true;
    };

    this.thrustRightStop = function () {
        this.rcsLeft = false;
    };

    this.move = function () {
        this.x += this.xVel;
        this.y += this.yVel;
    };

    this.getGunAngle = function () {
        return Math.atan2(mouse.y - canvas.height / 2, mouse.x - canvas.width / 2);
    };

    this.getDistanceTo = function (circle) {
        return Math.hypot(circle.y - this.y, circle.x - this.x);
    };

    this.collideWithAsteroid = function (asteroid) {
        return this.getDistanceTo(asteroid) < asteroid.images.body.image.width * asteroid.images.body.scale / 2 + this.images.body.image.height * this.images.body.scale / 2;
    };

    this.collideWithPart = function (part) {
        return this.getDistanceTo(part) < part.images.body.image.height * part.images.body.scale / 2 + this.images.body.image.height * this.images.body.scale / 2;
    };
}
