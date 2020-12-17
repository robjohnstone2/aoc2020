const { readFileSync } = require('fs');

const rawInput = readFileSync('./input.txt', 'utf8');
const rows = rawInput.split('\n').filter((r) => !!r);

/* part 1
const isCorrect = (row) => {
  const [rule, pwd] = row.split(': ');
  const [min, max] = rule.match(/\d+/g);
  const letter = rule.split(' ')[1];
  const occurrences = (pwd.match(new RegExp(letter, 'g')) || []).length;
  return occurrences >= Number(min) && occurrences <= Number(max);
};

const numCorrect = rows.reduce((correct, row) => {
  if (isCorrect(row)) {
    correct++;
  }
  return correct;
}, 0);
*/

const isCorrect = (row) => {
  const [rule, pwd] = row.split(': ');
  const positions = rule.match(/\d+/g);
  const letter = rule.split(' ')[1];
  const numMatches = positions.reduce((acc, pos) => {
    if (pwd[pos - 1] === letter) {
      acc++;
    }
    return acc;
  }, 0);
  return numMatches === 1;
};

const numCorrect = rows.reduce((correct, row) => {
  if (isCorrect(row)) {
    correct++;
  }
  return correct;
}, 0);

console.log('numCorrect', numCorrect);
