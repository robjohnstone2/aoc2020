const { readFileSync } = require('fs');

const rawInput = readFileSync('./input.txt', 'utf8');

const boardingPasses = rawInput.split('\n').filter((r) => !!r);

const divideRange = ([min, max], lower) => {
  const midpoint = min + Math.floor((max - min) / 2);
  return lower ? [min, midpoint] : [midpoint + 1, max];
};

const findSection = (initialRange) => (halves) =>
  halves.reduce(divideRange, initialRange)[0];
const findRow = findSection([0, 127]);
const findCol = findSection([0, 7]);

const findSeat = (seatCode) => {
  const chars = seatCode.split('');
  const row = findRow(chars.slice(0, 7).map((c) => c === 'F'));
  const col = findCol(chars.slice(7).map((c) => c === 'L'));
  return [row, col];
};

const findSeatId = (seatCode) => {
  const [row, col] = findSeat(seatCode);
  return row * 8 + col;
};

const ids = boardingPasses.map(findSeatId);
const maxId = Math.max(...ids);
console.log('maxId', maxId);

const missingIds = [];
for (let i = 0; i <= maxId; i++) {
  if (!ids.includes(i)) missingIds.push(i);
}

console.log('missingIds', missingIds);

const missingIdsWithPresentNeighbours = missingIds.filter(
  (id) => ids.includes(id - 1) && ids.includes(id + 1)
);
console.log('missingIdsWithPresentNeighbours', missingIdsWithPresentNeighbours);
