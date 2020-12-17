const { readFileSync } = require('fs');

const groups = readFileSync('./input.txt', 'utf8')
  .split('\n\n')
  .filter((g) => !!g);

const qsInGroup = (group) => new Set(group.replace(/[^a-z]/g, '').split(''));

console.log(
  'part1',
  groups.map(qsInGroup).reduce((a, g) => a + g.size, 0)
);

const allYes = (group) => {
  const people = group.trim().split('\n');
  const peopleAnswers = people.map(qsInGroup);
  return peopleAnswers.reduce((acc, personAnswers) => {
    return new Set([...acc].filter((a) => personAnswers.has(a)));
  });
};

console.log(
  'part2',
  groups.map(allYes).reduce((a, g) => a + g.size, 0)
);
