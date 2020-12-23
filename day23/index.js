const example = '389125467';
const input = '916438275';

const circle = input.split('').map((n) => parseInt(n));

const rotateLeft = (circle, n) => circle.slice(n).concat(circle.slice(0, n));

const move = (circle, max) => {
  const min = 1;
  const pickedUp = circle.slice(1, 4);
  const remaining = circle.slice(0, 1).concat(circle.slice(4));
  const currLabel = circle[0];
  let destinationLabel = currLabel - 1;
  while (!remaining.includes(destinationLabel)) {
    destinationLabel--;
    if (destinationLabel < min) destinationLabel = max;
  }
  const destinationIndex = remaining.indexOf(destinationLabel);
  const cupsBackIn = remaining
    .slice(0, destinationIndex + 1)
    .concat(pickedUp)
    .concat(remaining.slice(destinationIndex + 1));
  return rotateLeft(cupsBackIn, 1);
};

const playNMoves = (circle, max, n) => {
  for (let i = 0; i < n; i++) {
    circle = move(circle, max);
  }
  return circle;
};

const rotate1ToStart = (circle) => rotateLeft(circle, circle.indexOf(1));

const after100 = playNMoves(circle, 9, 100);
console.log('part1', rotate1ToStart(after100).join('').slice(1));

const range = (start, end) => {
  let result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};

class Circle {
  constructor(arr, min, max) {
    this.arr = arr;
    this.min = min;
    this.max = max;
    this.nodes = {};
    arr.forEach((num, i) => {
      this.nodes[num] = { value: num, next: null };
      if (i > 0) {
        const prevNode = this.nodes[arr[i - 1]];
        prevNode.next = this.nodes[num];
      }
    });
    this.nodes[arr[arr.length - 1]].next = this.nodes[arr[0]];
    this.currentNode = this.head();
  }

  head() {
    return this.nodes[this.arr[0]];
  }

  findNode(node) {
    return this.nodes[num];
  }

  move() {
    const pickedStart = this.currentNode.next;
    const pickedMiddle = pickedStart.next;
    const pickedEnd = pickedMiddle.next;
    this.currentNode.next = pickedEnd.next;
    let destinationValue = this.currentNode.value - 1;
    while (
      pickedStart.value === destinationValue ||
      pickedMiddle.value === destinationValue ||
      pickedEnd.value === destinationValue ||
      destinationValue < 1
    ) {
      if (destinationValue < 1) {
        destinationValue = this.max;
      } else {
        destinationValue--;
      }
    }
    const destNode = this.nodes[destinationValue];
    const nodeAfterInserted = destNode.next;
    destNode.next = pickedStart;
    pickedEnd.next = nodeAfterInserted;
    this.currentNode = this.currentNode.next;
  }

  moveNTimes(n) {
    for (let i = 0; i < n; i++) {
      this.move();
    }
  }

  toString() {
    const node1 = this.nodes[1];
    let next = node1.next;
    let result = '';
    while (next !== node1) {
      result += next.value.toString();
      next = next.next;
    }
    return result;
  }
}

const inputArr = input.split('').map((n) => parseInt(n));
const max2 = 1000000;
const input2 = inputArr.concat(range(Math.max(...inputArr) + 1, max2));

const circle2 = new Circle(input2, 1, max2);

circle2.moveNTimes(10000000);
const node1 = circle2.nodes[1];
const firstStar = node1.next;
const secondStar = firstStar.next;
console.log('first', firstStar.value, 'second', secondStar.value);
console.log('part2', firstStar.value * secondStar.value);
