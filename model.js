let model = {}

model.setNumbers = function(inputArray) {
  this.numbers = inputArray.map((x) => {
    return {value: x};
  });
  this.numbers.raw = inputArray;
  this.levels = this.linesCount(inputArray.length);
}

model.linesCount = function(n) {
  return ((-1 + Math.sqrt(1+8*n)) / 2);
}

model.getMaxDigits = function() {
  return Math.log(Math.max(...this.numbers.raw)) * Math.LOG10E + 1 | 0;
}

model.calculateSums = function() {

  for (let j = 0; j < this.levels; j++) {
    let currentIndex = (this.levels-1)*(this.levels)/2+j;
    this.numbers[currentIndex].sum = this.numbers[currentIndex].value;
  }

  for (let i = this.levels-2; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      let currentIndex = i*(i+1)/2+j;
      let childLeftIndex = (i+1)*(i+2)/2 + j;
      let childRightIndex = childLeftIndex + 1;

      let childLeftValue = model.numbers[childLeftIndex].sum
      let childRightValue = model.numbers[childRightIndex].sum;

      if (childLeftValue > childRightValue) {
        this.numbers[currentIndex].sum = this.numbers[currentIndex].value + childLeftValue;
        this.numbers[currentIndex].direction = "left";
        this.numbers[currentIndex].nextSolutionNodeIndex = childLeftIndex;
      } else {
        this.numbers[currentIndex].sum = this.numbers[currentIndex].value + childRightValue;
        this.numbers[currentIndex].direction = "right";
        this.numbers[currentIndex].nextSolutionNodeIndex = childRightIndex;
      }

    }
  }
}

model.solve = function() {
  this.calculateSums();
}

model.randomize = function(levels) {
  if (levels !== undefined) {
    this.levels = levels;
  }

  let numbers = [];
  for (let i = 1; i <= this.levels; i++) {
    for (let j = 0; j < i; j++) {
      numbers.push(getRandomInt(100));
    }
  }

  this.setNumbers(numbers);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
