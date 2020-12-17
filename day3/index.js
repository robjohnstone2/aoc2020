const { readFileSync } = require('fs');

const rawInput = readFileSync('./input.txt', 'utf8');

const rows = rawInput.split('\n').filter((r) => !!r);

const parsedRows = rows.map((row) => row.split(''));

const lookup = ([x, y]) => {
  const row = parsedRows[y];
  if (!row) return 'bottom';
  const square = row[x % row.length];
  return square === '.' ? 'open' : 'tree';
};

const move = (pos, [dx, dy]) => {
  pos[0] += dx;
  pos[1] += dy;
};

const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
];

const numTrees = slopes.map((slope) => {
  let pos = [0, 0];
  let trees = 0;
  let atBottom = false;
  while (!atBottom) {
    console.log(pos, lookup(pos));
    switch (lookup(pos)) {
      case 'tree':
        trees++;
        break;
      case 'bottom': {
        atBottom = true;
      }
    }
    move(pos, slope);
  }
  return trees;
});

console.log('num trees', numTrees);
console.log(
  'result',
  numTrees.reduce((a, n) => a * n, 1)
);
