let controller = {};

canvas.addEventListener('click', (e) => {
    controller.canvasClick(e);
});

document.getElementById("load-input-1-btn").addEventListener("click", function() {
    controller.loadInput("input1");
});

document.getElementById("load-input-2-btn").addEventListener("click", function() {
    controller.loadInput("input2");
});

function isIntersect(point, circle) {
  return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}

controller.canvasClick = function(e) {
    var rect = canvas.getBoundingClientRect();
    const pos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
    view.circles.forEach(circle => {
        if (isIntersect(pos, circle)) {
            view.solutionRoot = circle.index;
            view.clear();
            view.render();
            return;
        }
    });
}
controller.loadInput = function(value) {
    if (value == "input1") {
        this.reset(inputs.input1);
    } else if (value == "input2") {
        this.reset(inputs.input2);
    }
}

controller.reset = function(input) {
    if (input === undefined) {
        input = inputs.input2;
    }
    model.setNumbers(input);
    model.solve();
    this.showResult(model.numbers[0].sum);
    view.init(model.numbers, model.levels, model.getMaxDigits());
    view.clear();
    view.render();
}

controller.randomize = function(levels) {
    model.randomize(levels);
    model.solve();
    this.showResult(model.numbers[0].sum);
    view.init(model.numbers, model.levels, model.getMaxDigits());
    view.clear();
    view.render();
}

controller.showResult = function(value) {
    document.getElementById("result").textContent = "Result: " + value;
}

controller.handleRandomize = function() {
    this.randomize(model.levels);
}

controller.handleIncrease = function() {
    this.randomize(model.levels + 1);
}

controller.handleDecrease = function() {
    if (model.levels > 1) {
        this.randomize(model.levels - 1);
    } else {
        this.randomize(model.levels);
    }
}
