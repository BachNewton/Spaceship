function mouseDown() {
    mouseHeld = true;
}

function mouseUp() {
    mouseHeld = false;
}

function keyDown(evt) {
    keysHeld[evt.keyCode] = true;
}

function keyUp(evt) {
    keysHeld[evt.keyCode] = false;
}

function updateMousePosition(evt) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = evt.clientX - rect.left;
    mouse.y = evt.clientY - rect.top;
}

function scrollWheel(evt) {
    var magnitude = evt.deltaY;
    var zoomPower = 5000;

    if (magnitude < 0) {
        magnitude *= -1;
        globalScale *= 1 + (magnitude / zoomPower);
    } else {
        globalScale *= 1 - (magnitude / zoomPower);
    }
}
