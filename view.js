let canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const canvasPadding = 10;
let defaultFontSize = 18;

view = {}

view.init = function(numbers, levels, maxDigits, solutionRoot) {
    view.solutionRoot = solutionRoot;
    if (solutionRoot == undefined) {
        this.solutionRoot = 0;
    }
    this.numbers = numbers;
    this.levels = levels;
    this.maxDigits = maxDigits;
    this.circles = [];
    this.adjustFontSize();
}

view.adjustFontSize = function() {
    this.fontSize = defaultFontSize;
    ctx.font = this.fontSize + 'pt sans-serif';
    let lastLineWidth = this.getLastLineWidth();
    while (lastLineWidth > canvasWidth - 2 * canvasPadding ||
           3 * this.fontSize * this.levels > canvasHeight) {
        this.fontSize--;
        ctx.font = this.fontSize + 'pt sans-serif';
        lastLineWidth = this.getLastLineWidth();
    }
}

view.getLastLineWidth = function() {
    let lastLine = this.numbers.raw.slice(this.numbers.raw.length - this.levels);
    let lastLinePadded = lastLine.map((x)=> {return ('' + x).padStart(this.maxDigits, 0)})
    let lastLineString = lastLinePadded.join('99')
    let lineMeasure = ctx.measureText(lastLineString);
    return lineMeasure.width;
}

view.getNumberWidth = function() {
    return ctx.measureText((Math.max(...this.numbers.raw) + '').padStart(this.maxDigits, 0)).width;
}

view.getSpaceWidth = function() {
    return ctx.measureText('99').width;
}

view.render = function() {
    ctx.fillStyle = 'black';
    this.circles = [];

    let totalHeight = 1.5 * this.fontSize + this.fontSize * 3 * this.levels;
    let verticalOffset = (canvasHeight - totalHeight)/2;
    let horizontalOffset = (canvasWidth - this.getLastLineWidth()) / 2;

    let current = 0;
    let numberWidth = this.getNumberWidth();
    let spaceWidth = this.getSpaceWidth();

    let nextPathNode = this.solutionRoot;
    for (let i = 0; i < this.levels; i++) {
        for (let j = 0; j <= i; j++) {

            let columnOffset = (this.levels - i - 1)/2 * (numberWidth + spaceWidth);
            let x = horizontalOffset + columnOffset + j*(numberWidth + spaceWidth);
            let y = verticalOffset + 1.5 * this.fontSize + this.fontSize * 3 * i;

            if(i < this.levels-1) {
                this.numbers[current].direction;
                let columnOffsetNext = (this.levels - i)/2 * (numberWidth + spaceWidth);
                let xFrom = x + numberWidth/2;
                let yFrom = y - this.fontSize/2;
                let xNext;
                let yNext = verticalOffset + 1.5 * this.fontSize + this.fontSize * 3 * (i + 1) - this.fontSize/2;
                if (this.numbers[current].direction == 'left') {
                    xNext = horizontalOffset + columnOffsetNext + (j-1)*(numberWidth + spaceWidth) + numberWidth/2;
                } else {
                    xNext = horizontalOffset + columnOffsetNext + (j)*(numberWidth + spaceWidth) + numberWidth/2;
                }
                ctx.lineWidth = 2;
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                ctx.moveTo(xFrom, yFrom);
                ctx.lineTo(xNext, yNext);
                ctx.stroke();
                ctx.closePath();
            }

            let circle = {
                index: current,
                radius: this.fontSize,
                x: x + numberWidth/2,
                y: y - this.fontSize/2
            }
            this.circles.push(circle);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, 360);
            if (circle.index == nextPathNode) {
                ctx.fillStyle = 'pink';
                nextPathNode = this.numbers[current].nextSolutionNodeIndex;
            } else {
                ctx.fillStyle = 'lightgreen';
            }
            ctx.stroke();
            ctx.fill();
            ctx.closePath();

            let number = this.numbers[current].value;
            let numberPadded = (number + '').padStart(this.maxDigits, '0');
            ctx.fillStyle = 'black';
            ctx.fillText(numberPadded, x, y);

            current++;
        }
    }
}

view.clear = function() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}
