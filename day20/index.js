const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'utf8').trim();

const tileStrs = input.split('\n\n');

const rotate = (rows) => {
  const newRows = [];
  for (let i = 0; i < rows.length; i++) {
    const row = [];
    for (let j = 0; j < rows.length; j++) {
      row.push(rows[rows.length - j - 1][i]);
    }
    newRows.push(row);
  }

  return newRows.map((r) => r.join(''));
};

const flipHorizontal = (rows) =>
  rows.map((r) => r.split('').reverse().join(''));

class Tile {
  constructor(str) {
    const [idStr, ...rows] = str.split('\n');
    this.id = parseInt(idStr.split(' ')[1]);
    this.rows = rows;
    this.calcEdgeIds();
  }

  calcEdgeIds() {
    this.edgeIds = [];
    this.edgeIds.push(edgeStrToId(this.rows[0])); // N
    this.edgeIds.push(edgeStrToId(getColStrFromRows(this.rows, 9))); // E
    this.edgeIds.push(edgeStrToId(this.rows[9])); // S
    this.edgeIds.push(edgeStrToId(getColStrFromRows(this.rows, 0))); // W
  }

  draw() {
    this.rows.forEach((r) => console.log(r));
  }

  rotate() {
    this.rows = rotate(this.rows);
    this.calcEdgeIds();
  }

  rotateRightTimes(n) {
    for (let i = 0; i < n; i++) {
      this.rotate();
    }
  }

  rotateLeftTimes(n) {
    this.rotateRightTimes(4 - n);
  }

  flipHorizontal() {
    this.rows = flipHorizontal(this.rows);
    this.calcEdgeIds();
  }

  flipVertical() {
    this.rotate();
    this.flipHorizontal();
    this.rotate();
    this.rotate();
    this.rotate();
  }
}

const getColStrFromRows = (rows, index) =>
  rows.reduce((str, row) => str + row[index], '');

const edgeStrToId = (str) => {
  const binArr = str.split('').map((c) => (c === '.' ? '0' : '1'));
  const revBinArr = [...binArr].reverse();
  const ids = [binArr, revBinArr].map((a) => parseInt(a.join(''), 2));
  return Math.min(...ids);
};

const tiles = tileStrs.map((str) => new Tile(str));

const edgeIdsToTiles = tiles.reduce((acc, { id, edgeIds }) => {
  edgeIds.forEach((edgeId) => (acc[edgeId] = (acc[edgeId] || []).concat(id)));
  return acc;
}, {});

const uniqueEdges = Object.entries(edgeIdsToTiles).filter(
  ([edgeId, tileIds]) => tileIds.length === 1
);

const numEdgesPerTile = uniqueEdges.reduce((acc, [edgeId, [tileId]]) => {
  acc[tileId] = (acc[tileId] || 0) + 1;
  return acc;
}, {});

const cornerTiles = Object.entries(numEdgesPerTile)
  .filter(([tileId, numEdgesPerTile]) => numEdgesPerTile === 2)
  .map(([tileId]) => parseInt(tileId));

console.log(
  'part1',
  cornerTiles.reduce((a, n) => a * n)
);

const getConnectionBetween = (id1, id2) =>
  Object.entries(edgeIdsToTiles).find(
    ([edgeId, ids]) => ids.includes(id1) && ids.includes(id2)
  )[0];

class Grid {
  constructor(size) {
    this.layout = [];
    for (let i = 0; i < size; i++) {
      this.layout.push([]);
    }
    this.size = size;
  }

  addTile(tileId, x, y) {
    this.layout[y][x] = tileId;
  }

  getTileIdAtPos(x, y) {
    return this.layout[y][x];
  }

  getTileAtPos(x, y) {
    const tileId = this.getTileIdAtPos(x, y);
    return tiles.find(({ id }) => id === tileId);
  }

  showLayout() {
    this.layout.forEach((row) =>
      console.log(row.map((t) => t.toString().padStart(4, ' ')).join(' '))
    );
  }

  orientTiles() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const tileId = this.getTileIdAtPos(x, y);
        const tile = tiles.find(({ id }) => id === tileId);
        const current = tile.edgeIds.map((edgeId) => edgeId.toString());
        // enumerate desired edges from N clockwise (null indicates no connection)
        const desired = [];
        desired[0] =
          y === 0
            ? null
            : getConnectionBetween(tileId, this.getTileIdAtPos(x, y - 1));
        desired[1] =
          x === this.size - 1
            ? null
            : getConnectionBetween(tileId, this.getTileIdAtPos(x + 1, y));
        desired[2] =
          y === this.size - 1
            ? null
            : getConnectionBetween(tileId, this.getTileIdAtPos(x, y + 1));
        desired[3] =
          x === 0
            ? null
            : getConnectionBetween(tileId, this.getTileIdAtPos(x - 1, y));
        const firstNumericDesiredIndex = desired.findIndex(
          (edgeId) => edgeId !== null
        );
        const firstDesiredNumber = desired[firstNumericDesiredIndex];
        const indexOfCurrent = current.findIndex(
          (edgeId) => edgeId === firstDesiredNumber
        );
        const offset = firstNumericDesiredIndex - indexOfCurrent;
        if (offset > 0) {
          tile.rotateRightTimes(offset);
        } else {
          tile.rotateLeftTimes(Math.abs(offset));
        }

        const idsToMatch = desired.filter((edgeId) => edgeId !== null).length;
        const idsThatMatch = desired.filter(
          (edgeId, i) => Number(edgeId) === tile.edgeIds[i]
        ).length;

        if (idsToMatch !== idsThatMatch) {
          if (firstNumericDesiredIndex % 2 === 0) {
            tile.flipHorizontal();
          } else {
            tile.flipVertical();
          }
        }
      }
    }
  }

  showFull() {
    this.layout.forEach((row, y) => {
      const tiles = row.map((id, x) => this.getTileAtPos(x, y));
      for (let i = 0; i < tiles[0].rows.length; i++) {
        const sections = tiles.map((tile) => tile.rows[i]);
        console.log(sections.join(' '));
      }
      console.log('');
    });
  }

  generateImage() {
    const lines = [];
    this.layout.forEach((row, y) => {
      const tiles = row.map((id, x) => this.getTileAtPos(x, y));
      for (let i = 1; i < tiles[0].rows.length - 1; i++) {
        const sections = tiles.map((tile) => tile.rows[i].slice(1, -1));
        lines.push(sections.join(''));
      }
    });
    return lines;
  }
}

const findConnections = (tileId) =>
  Object.values(edgeIdsToTiles)
    .filter((tileIds) => tileIds.length > 1 && tileIds.includes(tileId))
    .map((tileIds) => tileIds.find((id) => id !== tileId));

const grid = new Grid(Math.sqrt(tiles.length));

grid.addTile(cornerTiles[0], 0, 0);
const placed = [cornerTiles[0]];

const placeTile = (x, y) => {
  let connectingTileIds = [];
  if (y > 0) {
    connectingTileIds.push(grid.getTileIdAtPos(x, y - 1));
  }
  if (x > 0) {
    connectingTileIds.push(grid.getTileIdAtPos(x - 1, y));
  }
  const connections = connectingTileIds
    .map(findConnections)
    .reduce((acc, connections) => {
      return acc.filter((id) => connections.includes(id));
    });
  const connectionsNotPlaced = connections.filter((id) => !placed.includes(id));
  const nextTileId = connectionsNotPlaced[0];
  grid.addTile(nextTileId, x, y);
  placed.push(nextTileId);
};

for (let arc = 1; arc < grid.size; arc++) {
  for (let i = 0; i < arc; i++) {
    let x = arc;
    let y = i;
    placeTile(x, y);
    placeTile(y, x);
  }
  placeTile(arc, arc);
}

console.log(`grid (size: ${grid.size})`);
grid.showLayout();

grid.orientTiles();
let image = grid.generateImage();
image.forEach((line) => console.log(line));

const monsterPattern =
  '                  # \n' + '#    ##    ##    ###\n' + ' #  #  #  #  #  #    ';

const patternPoints = monsterPattern.split('\n').map((line) =>
  Object.entries(line.split(''))
    .filter(([i, c]) => c === '#')
    .map(([dx]) => parseInt(dx))
);

const testForMonster = (imageLines, x, y) => {
  return patternPoints.reduce((acc, pointsForLine, dy) => {
    return (
      acc &&
      pointsForLine.reduce((acc, dx) => {
        return acc && imageLines[y + dy][x + dx] === '#';
      }, true)
    );
  }, true);
};

const countMonsters = (imageLines) => {
  const size = imageLines.length;
  let num = 0;
  for (let y = 0; y < size - 3; y++) {
    for (let x = 0; x < size - 19; x++) {
      if (testForMonster(image, x, y)) {
        num++;
      }
    }
  }
  return num;
};

let numMonsters = 0;
for (let i = 0; i < 8 && !numMonsters; i++) {
  numMonsters = countMonsters(image);
  image = rotate(image);
  if (i === 3) image = flipHorizontal(image);
}

const countHashes = (image) =>
  image.reduce((acc, line) => {
    return acc + line.split('').filter((c) => c === '#').length;
  }, 0);

const numHashesInImage = countHashes(image);

const numHashesInMonster = countHashes(monsterPattern.split('\n'));

console.log('part2', numHashesInImage - numMonsters * numHashesInMonster);
