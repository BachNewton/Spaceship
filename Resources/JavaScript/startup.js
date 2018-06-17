var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
var mouse = { x: -1, y: -1 };
var mouseHeld = false;
var keysHeld = {};
var globalScale = 1;
var MAX_DEPTH = 6;
var ROOT_GRID = new Grid(-200000, 200000, -200000, 200000, 0);
var frameStopwatch = new FrameStopwatch();
var debugMode = false;
var debugKeyWasReleased = true;
var debugKeyWasPressed = false;
document.getElementById('canvas').addEventListener('mousedown', mouseDown);
document.getElementById('canvas').addEventListener('mouseup', mouseUp);
document.getElementById('canvas').addEventListener('mousemove', updateMousePosition);
document.getElementById('canvas').addEventListener('wheel', scrollWheel);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

var spaceship = new Spaceship();
var lasers = [];
var asteroids = [];
var explosions = [];
var blocks = [];
var parts = [];
var asteroidImage = new Image();
asteroidImage.src = "Resources/Images/asteroid.png";
var explosionImage = new Image();
explosionImage.src = "Resources/Images/explosion.png";
var partImage = new Image();
partImage.src = "Resources/Images/part.png";

asteroids.push(new Asteroid(canvas.width * 0.2, canvas.height * 0.2, 1, 0, 1, Math.PI / 256));
asteroids.push(new Asteroid(canvas.width * 0.8, canvas.height * 0.2, 0, 1, 1, Math.PI / 256));
asteroids.push(new Asteroid(canvas.width * 0.2, canvas.height * 0.8, 0, -1, 1, Math.PI / 256));
asteroids.push(new Asteroid(canvas.width * 0.8, canvas.height * 0.8, -1, 0, 1, Math.PI / 256));

var density = 4000;
for (var i = 0; i < density; i++) {
    asteroids.push(new Asteroid(Math.random() * 200000 - 100000, Math.random() * 200000 - 100000, Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 2.75 + 0.25, Math.PI / 256));
}
