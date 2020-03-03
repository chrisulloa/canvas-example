function drawCircle(ctx, circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
}
function degreesToCoordinates(radius, degrees) {
    var radians = Math.PI * degrees / 180;
    ;
    return [radius * Math.cos(radians), radius * Math.sin(radians)];
}
function generateCircles(circleRadius, ringRadius, numCircles) {
    var circles = [];
    var circlePartitionSize = 360 / numCircles;
    var currentDegree = 0;
    while (currentDegree < 360) {
        var _a = degreesToCoordinates(ringRadius, currentDegree), x = _a[0], y = _a[1];
        var circle = {
            radius: circleRadius,
            x: x,
            y: y
        };
        circles.push(circle);
        currentDegree += circlePartitionSize;
    }
    return circles;
}
var DrawingApp = /** @class */ (function () {
    function DrawingApp(numCircles) {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext("2d");
        this.circleRadius = 10;
        this.ringRadius = 100;
        this.growRing = false;
        this.growCircles = false;
        this.numCircles = numCircles;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = 'white';
        context.lineWidth = 1;
        this.context = context;
        this.canvas = canvas;
    }
    DrawingApp.prototype.render = function () {
        var _this = this;
        var time = performance.now();
        var angle = ((time / 10) % 360);
        var circles = generateCircles(this.circleRadius, this.ringRadius, this.numCircles);
        this.context.save();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.rotate(angle * Math.PI / 180);
        for (var _i = 0, circles_1 = circles; _i < circles_1.length; _i++) {
            var circle = circles_1[_i];
            drawCircle(this.context, circle);
            this.circleRadius += (this.growCircles ? 0.02 : -0.02);
            this.ringRadius += (this.growRing ? 0.05 : -0.05);
            if (this.ringRadius < 30) {
                this.growRing = true;
            }
            if (this.ringRadius >= 200) {
                this.growRing = false;
            }
            if (this.circleRadius < 50) {
                this.growCircles = true;
            }
            if (this.circleRadius > 100) {
                this.growCircles = false;
            }
        }
        this.context.restore();
        this.context.fillStyle = "blue";
        this.context.globalCompositeOperation = 'destination-over';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        window.requestAnimationFrame(function (_t) { _this.render(); });
    };
    return DrawingApp;
}());
var drawingApp = new DrawingApp(25);
window.requestAnimationFrame(function (_t) { drawingApp.render(); });
//# sourceMappingURL=main.js.map