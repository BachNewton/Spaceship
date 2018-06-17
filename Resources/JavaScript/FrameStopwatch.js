function FrameStopwatch() {
    this.startTime = performance.now();

    this.reset = function () {
        this.startTime = performance.now();
    };

    this.draw = function () {
        var time = Math.floor(performance.now() - this.startTime);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = 'lime';
        ctx.font = '15px Arial';
        ctx.fillText('Time / Frame: ' + time + 'ms', 4, canvas.height - 4);
        ctx.restore();
    };
}
