const { readFileSync } = require('fs');

const rawDirections = readFileSync('./input.txt', 'utf8').trim().split('\n');

const parseDirections = (str) => {
  const chars = str.split('');
  const dirs = [];
  while (chars.length) {
    const next = chars.shift();
    if (next === 'e' || next === 'w') {
      dirs.push(next);
    } else {
      const second = chars[0];
      if (second === 'e' || second === 'w') {
        chars.shift();
        dirs.push(next + second);
      }
    }
  }
  return dirs;
};

const directions = rawDirections.map(parseDirections);

const black = {};

const directionsToCoords = (directions) => {
  let [x, y] = [0, 0];
  while (directions.length) {
    const next = directions.shift();
    if (next === 'w') x--;
    else if (next === 'e') x++;
    else if (next === 'nw') {
      if (y % 2 !== 0) x--;
      y++;
    } else if (next === 'ne') {
      if (y % 2 === 0) x++;
      y++;
    } else if (next === 'sw') {
      if (y % 2 !== 0) x--;
      y--;
    } else if (next === 'se') {
      if (y % 2 === 0) x++;
      y--;
    }
  }
  return [x, y];
};

directions.forEach((dirs) => {
  const coords = directionsToCoords(dirs);
  const key = coords.join();
  black[key] = !black[key];
});

const getNumBlack = () => Object.values(black).filter((b) => b).length;

const numBlack = getNumBlack();
console.log('part1', Object.values(black).filter((b) => b).length);

const getNeighbours = ([x, y]) => [
  // w
  [x - 1, y],
  // e
  [x + 1, y],
  // nw
  [y % 2 ? x - 1 : x, y + 1],
  // ne
  [y % 2 ? x : x + 1, y + 1],
  // sw
  [y % 2 ? x - 1 : x, y - 1],
  // se
  [y % 2 ? x : x + 1, y - 1],
];

const minMax = (arr) => [Math.min(...arr), Math.max(...arr)];

const getBounds = () => {
  const coords = Object.keys(black).map((k) =>
    k.split(',').map((n) => parseInt(n))
  );
  const xs = coords.map(([x]) => x);
  const ys = coords.map(([, y]) => y);
  return [minMax(xs), minMax(ys)];
};

for (let i = 0; i < 100; i++) {
  const changes = [];
  const [xBounds, yBounds] = getBounds();

  for (let y = yBounds[0] - 1; y <= yBounds[1] + 1; y++) {
    for (let x = xBounds[0] - 1; x <= xBounds[1] + 1; x++) {
      const neighbours = getNeighbours([x, y]);
      const numBlack = neighbours
        .map((pos) => black[pos.join()])
        .filter((b) => b).length;
      const key = [x, y].join();
      if (black[key]) {
        if (numBlack === 0 || numBlack > 2) {
          changes.push([key, false]);
        }
      } else {
        if (numBlack === 2) {
          changes.push([key, true]);
        }
      }
    }
  }

  changes.forEach(([key, isBlack]) => (black[key] = isBlack));
}

console.log('part2', getNumBlack());
