const { readFileSync } = require('fs');

const [earliestStr, timetable] = readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n');

const earliest = parseInt(earliestStr);

const ids = timetable
  .split(',')
  .map(Number)
  .filter((n) => !!n);

const soonest = ids
  .map((id) => [id, id - (earliest % id)])
  .sort((a, b) => a[1] - b[1])[0][0];

const arrives = (Math.floor(earliest / soonest) + 1) * soonest;

console.log('part1', (arrives - earliest) * soonest);

const idsAndOffsets = timetable.split(',').reduce((acc, id, i) => {
  if (id !== 'x') {
    acc[id] = i;
  }
  return acc;
}, {});

console.log('idsAndOffsets', idsAndOffsets);

const [t] = Object.entries(idsAndOffsets).reduce(
  ([t, interval], [idStr, offset], i, entries) => {
    let prevT = t;
    const id = Number(idStr);
    const firstTwoValidTs = [];
    while (firstTwoValidTs.length < 2) {
      if ((t + offset) % id === 0) {
        firstTwoValidTs.push(t);
      }
      t += interval;
    }
    const newInterval = firstTwoValidTs[1] - firstTwoValidTs[0];
    return [firstTwoValidTs[0], newInterval];
  },
  [Number(Object.keys(idsAndOffsets)[0]), 1]
);

console.log('t', t);
