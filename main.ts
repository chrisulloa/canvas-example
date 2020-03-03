interface Circle {
    radius: number,
    x: number,
    y: number
}

function drawCircle(ctx: CanvasRenderingContext2D, circle: Circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function degreesToCoordinates(radius: number, degrees: number): [number, number] {
    let radians = Math.PI * degrees / 180;;
    return [radius * Math.cos(radians), radius * Math.sin(radians)]
}


function generateCircles(circleRadius: number, ringRadius: number, numCircles: number): Circle[] {
    let circles: Circle[] = [];
    let circlePartitionSize: number = 360 / numCircles;
    let currentDegree = 0;

    while (currentDegree < 360) {
        let [x, y] = degreesToCoordinates(ringRadius, currentDegree);
        let circle = {
            radius: circleRadius,
            x: x,
            y: y
        }
        circles.push(circle);
        currentDegree += circlePartitionSize;
    }

    return circles;
}

class DrawingApp {
    private context: CanvasRenderingContext2D;
    public canvas: HTMLCanvasElement;
    private circleRadius: number;
    private ringRadius: number;
    private growRing: boolean;
    private growCircles: boolean;
    private numCircles: number;

    constructor(numCircles: number) {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let context = canvas.getContext("2d");
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

    render() {
        let time = performance.now();
        let angle: number = ((time / 10) % 360);
        let circles: Circle[] = generateCircles(this.circleRadius, this.ringRadius, this.numCircles);

        this.context.save();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2)
        this.context.rotate(angle * Math.PI / 180);
        for (let circle of circles) {
            drawCircle(this.context, circle);

            this.circleRadius += (this.growCircles ? 0.02 : -0.02)
            this.ringRadius += (this.growRing ? 0.05 : -0.05)
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
        this.context.restore()
        this.context.fillStyle = "blue";
        this.context.globalCompositeOperation = 'destination-over';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        window.requestAnimationFrame((_t) => { this.render() });
    }
}

let drawingApp = new DrawingApp(25);
window.requestAnimationFrame(function (_t) { drawingApp.render() });