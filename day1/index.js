const { readFileSync } = require('fs');

const inputText = readFileSync('./input.txt', 'utf8');

const entries = inputText
  .split('\n')
  .filter((e) => !!e)
  .map((e) => parseInt(e, 10));

let numbers = [];

/* part 1
while (entries.length) {
  const first = entries.shift();
  const addsTo2020 = entries.find((e) => first + e === 2020);
  if (addsTo2020) {
    numbers.push(first);
    numbers.push(addsTo2020);
    break;
  }
}

if (!numbers.length) {
  console.error('Unable to find numbers that add to 2020! :(');
  process.exit(1);
}

console.log('numbers', numbers);
console.log('answer', numbers[0] * numbers[1]);
*/

for (let first = 0; first < entries.length - 3; first++) {
  for (let second = first + 1; second < entries.length - 2; second++) {
    for (let third = second + 1; third < entries.length - 1; third++) {
      if (entries[first] + entries[second] + entries[third] === 2020) {
        console.log('found answer');
        numbers.push(entries[first]);
        numbers.push(entries[second]);
        numbers.push(entries[third]);
      }
    }
  }
}

if (numbers.length !== 3) {
  console.error('Unable to find 3 numbers that add to 2020');
  process.exit(1);
}

console.log('numbers', numbers.join(', '));
console.log(
  'answer',
  numbers.reduce((acc, n) => acc * n)
);
