var FPS = 60;
var INTERVAL = 1000 / FPS;
var then = 0;
draw();

function draw(timestamp) {
    requestAnimationFrame(draw);

    var delta = timestamp - then;

    if (delta > INTERVAL) {
        then = timestamp - (delta % INTERVAL);
        frame();
    }
}

function frame() {
    frameStopwatch.reset();
    debugCheck();
    moveCamera();
    drawAsteroids();
    drawBlocks();
    drawSpaceship();
    drawLasers();
    drawParts();
    drawExplosions();
    drawHUD();
}

function debugCheck() {
    // \
    if (keysHeld[220]) {
        debugKeyWasPressed = true;
        if (debugKeyWasReleased) {
            debugMode = !debugMode;
            debugKeyWasReleased = false;
        }
    } else {
        if (debugKeyWasPressed) {
            debugKeyWasReleased = true;
        }
    }
}

function moveCamera() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(globalScale, 0, 0, globalScale, -(globalScale - 1) * canvas.width / 2, -(globalScale - 1) * canvas.height / 2);
    ctx.translate(-spaceship.x + canvas.width / 2, -spaceship.y + canvas.height / 2);
}

function drawAsteroids() {
    for (var i = 0; i < asteroids.length; i++) {
        asteroids[i].draw();

        if (debugMode) {
            asteroids[i].drawHitBox();
        }

        asteroids[i].move();
    }
}

function drawBlocks() {
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].draw();
        blocks[i].move();

        if (!blocks[i].connected) {
            var zone = blocks[i].grid.objects.blocks;

            for (var j = 0; j < zone.length; j++) {
                blocks[i].checkConnection(zone[j]);
                if (blocks[i].connected) {
                    break;
                }
            }
        }
    }
}

function drawSpaceship() {
    spaceship.draw();

    if (debugMode) {
        spaceship.drawHitBox();
    }

    spaceship.update();
    spaceship.move();

    var zone = ROOT_GRID.getGrid(spaceship.x, spaceship.y).objects.asteroids;

    for (var i = 0; i < zone.length; i++) {
        if (spaceship.collideWithAsteroid(zone[i])) {
            spaceship.hit();
        }
    }

    zone = ROOT_GRID.getGrid(spaceship.x, spaceship.y).objects.parts;

    for (var i = 0; i < zone.length; i++) {
        if (spaceship.collideWithPart(zone[i])) {
            spaceship.pickUpPart();
            var index = parts.indexOf(zone[i]);
            parts.splice(index, 1);
            zone.splice(i, 1);
            i--;
        }
    }
}

function drawLasers() {
    for (var i = 0; i < lasers.length; i++) {
        lasers[i].draw();
        lasers[i].move();

        var point = lasers[i].getCollisionPoint();
        var grid = ROOT_GRID.getGrid(point.x, point.y);
        var zone = grid.objects.asteroids;

        if (debugMode) {
            grid.highlight();
        }

        for (var j = 0; j < zone.length; j++) {
            if (debugMode) {
                zone[j].mark();
            }

            if (lasers[i].collideWith(zone[j])) {
                explosions.push(new Explosion(point.x, point.y, zone[j].xVel, zone[j].yVel));
                makeParts(lasers[i], zone[j]);
                lasers.splice(i, 1);
                i--;
                var index = asteroids.indexOf(zone[j]);
                asteroids.splice(index, 1);
                zone.splice(j, 1);
                break;
            }
        }
    }
}

function makeParts(laser, asteroid) {
    var point = laser.getCollisionPoint();
    var angle = laser.angle;
    var xVel = asteroid.xVel;
    var yVel = asteroid.yVel;
    var speed = 3;

    var numOfParts = Math.floor(asteroid.size / 0.5);

    for (var i = 0; i < numOfParts; i++) {
        var thisAngle = angle + Math.random() * Math.PI / 2 - Math.PI / 4;
        var part = new Part(point.x, point.y, xVel + speed * Math.cos(thisAngle), yVel + speed * Math.sin(thisAngle), thisAngle);
        parts.push(part);
    }
}

function drawParts() {
    for (var i = 0; i < parts.length; i++) {
        parts[i].draw();

        if (debugMode) {
            parts[i].drawHitBox();
        }

        parts[i].move();
    }
}

function drawExplosions() {
    for (var i = 0; i < explosions.length; i++) {
        explosions[i].draw();
        explosions[i].update();
        explosions[i].move();

        if (explosions[i].life <= 0) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

function drawHUD() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Space Station Parts: ' + spaceship.parts.toLocaleString('en'), 4, 34);

    if (spaceship.hitPoints <= 0) {
        ctx.fillStyle = 'red';
        ctx.font = '150px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER!', canvas.width / 2, canvas.height / 2 + 75);
    }

    ctx.restore();

    spaceship.drawHearts();

    if (debugMode) {
        ROOT_GRID.draw();
        frameStopwatch.draw();
    }
}
