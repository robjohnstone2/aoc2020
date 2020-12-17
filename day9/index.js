const { readFileSync } = require('fs');

const numbers = readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n')
  .map((n) => parseInt(n));

const isValid = (number, parts) => {
  for (let i = 0; i < parts.length - 1; i++) {
    for (let j = i + 1; j < parts.length; j++) {
      if (parts[i] !== parts[j] && parts[i] + parts[j] === number) {
        return true;
      }
    }
  }
};

const findError = (numbers, preambleLength) => {
  for (let i = preambleLength; i < numbers.length; i++) {
    const numberToCheck = numbers[i];
    const parts = numbers.slice(i - preambleLength, i);
    if (!isValid(numberToCheck, parts)) {
      return [numberToCheck, i];
    }
  }
};

const [num, index] = findError(numbers, 25);
console.log(num, index);

const isSetValid = (tgt, set) => {
  return tgt === set.reduce((a, n) => a + n);
};

const findSet = (number, index, numbers) => {
  for (let i = 0; i < index - 1; i++) {
    for (let j = i + 1; j < index; j++) {
      const set = numbers.slice(i, j + 1);
      if (isSetValid(number, set)) return set;
    }
  }
};

const set = findSet(num, index, numbers);

console.log('result', Math.min(...set) + Math.max(...set));
