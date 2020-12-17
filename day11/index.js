const { readFileSync } = require('fs');

const rawInput = readFileSync('./input.txt', 'utf8');

const parse = (str) =>
  str
    .trim()
    .split('\n')
    .map((r) => r.split(''));

let seats = parse(rawInput);

const lookup = ([x, y]) => y >= 0 && y < seats.length && seats[y][x];
const change = ([x, y], newValue) => (seats[y][x] = newValue);

const checkPos = (value) => (pos) => lookup(pos) === value;
const isEmpty = checkPos('L');
const isOccupied = checkPos('#');
const isFloor = checkPos('.');

const numAdjacentOccupied = ([x, y]) => {
  const positionsToCheck = [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
    [x, y + 1],
    [x - 1, y + 1],
    [x - 1, y],
  ];
  return positionsToCheck.map(isOccupied).filter((o) => o).length;
};

const drawGrid = (label) => {
  const header = `=== ${label} ===`;
  console.log(header);
  seats.forEach((s) => console.log(s.join('')));
  console.log(header.replace(/./g, '-'));
  console.log('');
};

const step = (neighboursFn, maxNeighbours) => () => {
  const changes = [];
  for (let x = 0; x < seats[0].length; x++) {
    for (let y = 0; y < seats.length; y++) {
      const pos = [x, y];
      /* const numNeighbours = numAdjacentOccupied(pos); */
      const numNeighbours = neighboursFn(pos);
      if (isEmpty(pos) && numNeighbours === 0) {
        changes.push([pos, '#']);
      } else if (isOccupied(pos) && numNeighbours >= maxNeighbours) {
        changes.push([pos, 'L']);
      }
    }
  }
  changes.forEach(([pos, newValue]) => change(pos, newValue));
  return changes.length;
};

const run = (fn) => {
  let steps = 0;
  let c;
  while ((c = fn()) !== 0) {
    steps++;
  }
};
run(step(numAdjacentOccupied, 4));

const countOccupied = () => {
  let result = 0;
  for (let x = 0; x < seats[0].length; x++) {
    for (let y = 0; y < seats.length; y++) {
      if (isOccupied([x, y])) result++;
    }
  }
  return result;
};

console.log('part 1', countOccupied());

seats = parse(rawInput);

const seatsVisibleFrom = ([x, y]) => {
  const vectors = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, +1],
    [0, +1],
    [-1, +1],
    [-1, 0],
  ];
  return vectors.reduce((acc, [dx, dy]) => {
    let posToCheck = [x, y];
    while (true) {
      posToCheck = [posToCheck[0] + dx, posToCheck[1] + dy];
      if (
        posToCheck[0] < 0 ||
        posToCheck[0] >= seats[0].length ||
        posToCheck[1] < 0 ||
        posToCheck[1] >= seats.length
      ) {
        break;
      } else if (!isFloor(posToCheck)) {
        acc.push(posToCheck);
        break;
      }
    }
    return acc;
  }, []);
};

const step2 = () => {
  const changes = [];
  for (let x = 0; x < seats[0].length; x++) {
    for (let y = 0; y < seats.length; y++) {
      const pos = [x, y];
      /* const numNeighbours = numAdjacentOccupied(pos); */
      const numNeighbours = seatsVisibleFrom(pos).filter(isOccupied).length;
      if (isEmpty(pos) && numNeighbours === 0) {
        changes.push([pos, '#']);
      } else if (isOccupied(pos) && numNeighbours >= 5) {
        changes.push([pos, 'L']);
      }
    }
  }
  changes.forEach(([pos, newValue]) => change(pos, newValue));
  return changes.length;
};

run(step((pos) => seatsVisibleFrom(pos).filter(isOccupied).length, 5));

/* steps = 0;
 * while ((c = step2()) !== 0) {
 *   steps++;
 * } */

console.log('part 2', countOccupied());
