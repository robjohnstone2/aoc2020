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

// t % 7  === 0 &&
// t % 13 === 13 -1 &&
// t % 59 === 59 - 4 &&
// t % 31 === 31 - 6 &&
// t % 19 === 19 - 7 &&
// t % key === key - offset
//

// t % 13 = 13 - 1 = 12
// t % 59 = 59 - 4 = 55
// t % 59 = t % 13 + 43

// t = 7a
// t = 13b - 1
/*
   t     t%7 t%13
   7     0   6
   14    0   1
   21    0   8
   28    0   2
   35    0   9
   42    0   3
   49    0   10


*/

// const tChangesWithOffset = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((offset) => {
//   let t = 1;
//   while (true) {
//     if (t % 2 === 0 && (t + offset) % 3 === 0) {
//       break;
//     }
//     t++;
//   }
//   return t;
// });
// console.log('tChangesWithOffset', tChangesWithOffset);

// let t = 0;
// while (t < 100) {
//   if (t % 2 === 0 && (t + 1) % 3 === 0) {
//     console.log('valid t', t);
//   }
//   t++;
// }

/* const findFirstTwoValidTs = ([[key1, offset1], [key2, offset2]]) => {
 *   console.log(key1, offset1, key2, offset2);
 * };
 * findFirstTwoValidTs([[]]) */
// const validTs = [];
// let t = 1;
// let interval = 1;

//console.log('validTs', validTs);

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

// while (
//   t % 7 != 0 &&
//   (t + 1) % 13 !== 0 //&&
//   /* (i * 59 + 2) % 31 !== 0 &&
//    * (i * 59 + 3) % 19 !== 0 */
// ) {
//   t = t += 7;
// }
//console.log('t', t);

/* const t = Object.entries(idsAndOffsets).reduce(
 *   (t, [idStr, offset], i, entries) => {
 *     const id = Number(idStr);
 *     console.log('id', id);
 *     if (Array.isArray(t)) {
 *       console.log('converting array');
 *       t = Number(t[0]);
 *     }
 *     console.log('t', t);
 *     const firstId = Number(entries[0][0]);
 *     const multipleOfFirst = t / firstId;
 *     console.log('multipleOfFirst', multipleOfFirst);
 *     const originalT = t;
 *     while ((t + offset) % id !== 0) {
 *       t += originalT;
 *     }
 *     console.log('new t', t);
 *     return t;
 *   }
 * ); */

/// console.log('t', t);
