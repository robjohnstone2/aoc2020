const { readFileSync } = require('fs');

const rawInput = readFileSync('./input.txt', 'utf8').trim();

const rows = rawInput.split('\n');

const parseRule = (str) => {
  const [outerColour, innerStr] = str.split(' bags contain ');
  if (innerStr === 'no other bags.') return [outerColour, []];
  const innerColours = innerStr
    .split(/ bags?,?\s?/)
    .filter((s) => s !== '.')
    .map((colStr) => {
      const match = /^(\d+)\s(\w+\s\w+)/.exec(colStr);
      return [parseInt(match[1]), match[2]];
    });
  return [outerColour, innerColours];
};

const rules = rows.map(parseRule);

const findRulesContainingColour = (colour) =>
  rules.filter((r) => {
    const innerColours = r[1].map(([num, col]) => col);
    return innerColours.includes(colour);
  });

const findValidOuterColours = (colour) => {
  const containers = findRulesContainingColour(colour).map((r) => r[0]);
  return Array.from(
    new Set(containers.concat(...containers.flatMap(findValidOuterColours)))
  );
};

console.log('part1', findValidOuterColours('shiny gold').length);

const findContents = (colour) => {
  const rule = rules.find((r) => r[0] === colour);
  return rule[1].reduce(
    (count, [quantity, col]) => count + quantity * findContents(col),
    1
  );
};

console.log('find contents', findContents('shiny gold') - 1);
