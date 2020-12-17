const { readFileSync } = require('fs');

let adapters = readFileSync('./input.txt', 'utf8')
  .split('\n')
  .filter((r) => !!r)
  .map((n) => parseInt(n));

adapters.push(0, Math.max(...adapters) + 3);
adapters = adapters.sort((a, b) => a - b);

const arrOfDiffs = adapters.reduce((acc, adapter, i) => {
  if (i > 0) {
    const diff = adapter - adapters[i - 1];
    acc.push(diff);
  }
  return acc;
}, []);

const count = (arr, val) => arrOfDiffs.filter((elm) => elm === val).length;
console.log('part1', count(arrOfDiffs, 1) * count(arrOfDiffs, 3));

const sectionLengths = arrOfDiffs
  .join('')
  .split('3')
  .map((s) => s.length)
  .filter((n) => !!n);

const numPathsInSection = (nums) => {
  if (nums === 0) return 0;
  if (nums < 3) return 1;
  return (
    numPathsInSection(nums - 1) +
    numPathsInSection(nums - 2) +
    numPathsInSection(nums - 3)
  );
};

console.log(
  'part2',
  sectionLengths
    .map((l) => numPathsInSection(l + 1))
    .reduce((acc, n) => acc * n)
);
