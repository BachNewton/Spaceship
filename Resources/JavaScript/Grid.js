function Grid(leftBound, rightBound, topBound, bottomBound, depth) {
    this.centerX = (leftBound + rightBound) / 2;
    this.centerY = (topBound + bottomBound) / 2;

    if (depth >= MAX_DEPTH) {
        this.objects = {
            asteroids: [],
            blocks: [],
            parts: []
        };
        this.color = getRandomColor(0.8);
        this.leftBound = leftBound;
        this.rightBound = rightBound;
        this.topBound = topBound;
        this.bottomBound = bottomBound;
    } else {
        this.topLeft = new Grid(leftBound, this.centerX, topBound, this.centerY, depth + 1);
        this.topRight = new Grid(this.centerX, rightBound, topBound, this.centerY, depth + 1);
        this.bottomLeft = new Grid(leftBound, this.centerX, this.centerY, bottomBound, depth + 1);
        this.bottomRight = new Grid(this.centerX, rightBound, this.centerY, bottomBound, depth + 1);
    }

    this.getGrid = function (x, y) {
        if (this.objects != undefined) {
            return this;
        } else {
            if (x < this.centerX && y < this.centerY) {
                return this.topLeft.getGrid(x, y);
            } else if (x >= this.centerX && y < this.centerY) {
                return this.topRight.getGrid(x, y);
            } else if (x < this.centerX && y >= this.centerY) {
                return this.bottomLeft.getGrid(x, y);
            } else {
                return this.bottomRight.getGrid(x, y);
            }
        }
    };

    this.draw = function () {
        if (this.objects != undefined) {
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 50;
            ctx.strokeRect(this.leftBound, this.topBound, this.rightBound - this.leftBound, this.bottomBound - this.topBound);
        } else {
            this.topLeft.draw();
            this.topRight.draw();
            this.bottomLeft.draw();
            this.bottomRight.draw();
        }
    };

    this.highlight = function () {
        ctx.fillStyle = 'rgba(255,255,0,0.1)';
        ctx.fillRect(this.leftBound, this.topBound, this.rightBound - this.leftBound, this.bottomBound - this.topBound);
    };
}

function getRandomColor(alpha) {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
}
