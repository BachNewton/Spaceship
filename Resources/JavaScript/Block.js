function Block(x, y, xVel, yVel) {
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.grid = ROOT_GRID.getGrid(this.x, this.y);
    this.grid.objects.blocks.push(this);
    this.connected = false;
    this.checked = false;
    this.images = {
        body: spaceship.images.block
    };

    this.draw = function () {
        ctx.drawImage(this.images.body.image, this.x - this.images.body.image.width / 2, this.y - this.images.body.image.height / 2, this.images.body.image.width, this.images.body.image.height);
    };

    this.move = function () {
        this.moveTo(this.x + this.xVel, this.y + this.yVel);
    };

    this.moveTo = function (x, y) {
        var newGrid = ROOT_GRID.getGrid(x, y);

        if (this.grid != newGrid) {
            var index = this.grid.objects.blocks.indexOf(this);
            this.grid.objects.blocks.splice(index, 1);
            newGrid.objects.blocks.push(this);
            this.grid = newGrid;
        }

        this.x = x;
        this.y = y;
    };

    this.getCollisionRect = function () {
        return {
            x: this.x - this.images.body.image.width / 2,
            y: this.y - this.images.body.image.height / 2,
            width: this.images.body.image.width,
            height: this.images.body.image.height
        };
    };

    this.findAdjacentBlocks = function (block, x, y) {
        this.checked = true;

        if (x == -1 && y == 0) {
            this.right = block;
            block.left = this;
        } else if (x == 1 && y == 0) {
            this.left = block;
            block.right = this;
        } else if (x == 0 && y == -1) {
            this.bottom = block;
            block.top = this;
        } else if (x == 0 && y == 1) {
            this.top = block;
            block.bottom = this;
        }

        if (this.left != undefined && !this.left.checked) {
            this.left.findAdjacentBlocks(block, x - 1, y);
        }

        if (this.right != undefined && !this.right.checked) {
            this.right.findAdjacentBlocks(block, x + 1, y);
        }

        if (this.top != undefined && !this.top.checked) {
            this.top.findAdjacentBlocks(block, x, y - 1);
        }

        if (this.bottom != undefined && !this.bottom.checked) {
            this.bottom.findAdjacentBlocks(block, x, y + 1);
        }

        this.checked = false;
    };

    this.checkConnection = function (block) {
        if (this != block) {
            var rect1 = this.getCollisionRect();
            var rect2 = block.getCollisionRect();

            if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y) {
                var foundConnection = false;

                var deltaX = this.x - block.x;
                var deltaY = this.y - block.y;

                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Left Side
                    if (block.left == undefined && deltaX < 0) {
                        this.x = block.x - rect2.width;
                        this.y = block.y;
                        block.left = this;
                        this.right = block;
                        foundConnection = true;
                    }
                    // Right Side
                    else if (block.right == undefined && deltaX >= 0) {
                        this.x = block.x + rect2.width;
                        this.y = block.y;
                        block.right = this;
                        this.left = block;
                        foundConnection = true;
                    }
                } else {
                    // Top Side
                    if (block.top == undefined && deltaY < 0) {
                        this.y = block.y - rect2.height;
                        this.x = block.x;
                        block.top = this;
                        this.bottom = block;
                        foundConnection = true;
                    }
                    // Bottom Side
                    else if (block.bottom == undefined && deltaY >= 0) {
                        this.y = block.y + rect2.height;
                        this.x = block.x;
                        block.bottom = this;
                        this.top = block;
                        foundConnection = true;
                    }
                }

                if (foundConnection) {
                    new Audio("Resources/Sounds/snapIntoPlace.wav").play();
                    this.connected = true;
                    block.connected = true;
                    this.xVel = block.xVel;
                    this.yVel = block.yVel;
                    this.findAdjacentBlocks(this, 0, 0);
                }
            }
        }
    };
}
