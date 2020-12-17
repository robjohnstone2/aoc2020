const { readFileSync } = require('fs');

class State {
  constructor(inputFile) {
    this.grid = new Set();
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.minZ = 0;
    this.maxZ = 0;
    this.minW = 0;
    this.maxW = 0;
    const lines = readFileSync(inputFile, 'utf8').split('\n');
    lines.forEach((line, y) => {
      const chars = line.split('');
      chars.forEach((char, x) => {
        if (char === '#') {
          this.makeActive([x, y, 0, 0]);
        }
      });
    });
    this.cycles = 0;
  }

  makeActive([x, y, z, w]) {
    this.grid.add(this.getKey([x, y, z, w]));
    this.minX = x < this.minX ? x : this.minX;
    this.maxX = x > this.maxX ? x : this.maxX;
    this.minY = y < this.minY ? y : this.minY;
    this.maxY = y > this.maxY ? y : this.maxY;
    this.minZ = z < this.minZ ? z : this.minZ;
    this.maxZ = z > this.maxZ ? z : this.maxZ;
    this.minW = z < this.minW ? z : this.minW;
    this.maxW = z > this.maxW ? z : this.maxW;
  }

  makeInactive([x, y, z, w]) {
    this.grid.delete(this.getKey([x, y, z, w]));
    // potentially need to adjust bounds but not sure if it's really needed
  }

  getKey(pos) {
    return pos.join(',');
  }

  isActive(pos) {
    return this.grid.has(this.getKey(pos));
  }

  draw() {
    console.log(`After ${this.cycles} cycles`);
    for (let w = this.minW; w <= this.maxW; w++) {
      for (let z = this.minZ; z <= this.maxZ; z++) {
        console.log(`z=${z}`);
        for (let y = this.minY; y <= this.maxY; y++) {
          let row = '';
          for (let x = this.minX; x <= this.maxX; x++) {
            row += this.isActive([x, y, z, w]) ? '#' : '.';
          }
          console.log(row);
        }
        console.log();
      }
    }
    console.log();
  }

  getNeighbours([X, Y, Z, W]) {
    const neighbours = [];
    for (let w = W - 1; w <= W + 1; w++) {
      for (let z = Z - 1; z <= Z + 1; z++) {
        for (let y = Y - 1; y <= Y + 1; y++) {
          for (let x = X - 1; x <= X + 1; x++) {
            if (!(x === X && y === Y && z === Z && w === W))
              neighbours.push([x, y, z, w]);
          }
        }
      }
    }
    return neighbours;
  }

  numActiveNeighbours(pos) {
    return this.getNeighbours(pos).filter((pos) => this.isActive(pos)).length;
  }

  iterate(iterations = 1) {
    for (let i = 0; i < iterations; i++) {
      this.cycles++;
      const cellsToMakeActive = [];
      const cellsToMakeInactive = [];
      for (let w = this.minW - 1; w <= this.maxW + 1; w++) {
        for (let z = this.minZ - 1; z <= this.maxZ + 1; z++) {
          for (let y = this.minY - 1; y <= this.maxY + 1; y++) {
            for (let x = this.minX - 1; x <= this.maxX + 1; x++) {
              const activeNeighbours = this.numActiveNeighbours([x, y, z, w]);
              if (this.isActive([x, y, z, w])) {
                if (activeNeighbours !== 2 && activeNeighbours !== 3) {
                  cellsToMakeInactive.push([x, y, z, w]);
                }
              } else if (activeNeighbours === 3) {
                cellsToMakeActive.push([x, y, z, w]);
              }
            }
          }
        }
      }
      cellsToMakeActive.forEach((pos) => this.makeActive(pos));
      cellsToMakeInactive.forEach((pos) => this.makeInactive(pos));
    }
  }

  countActive() {
    return this.grid.size;
  }
}

const state = new State('./input.txt');
/* state.draw(); */
state.iterate(6);
/* state.draw(); */
console.log('part1', state.countActive());
