const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'utf8').trim();

const [rulesStr, myTicketStr, nearbyTicketsStr] = input
  .split('\n')
  .filter((row) => !/ticket/.test(row))
  .join('\n')
  .split('\n\n');

const parseRange = (rangeStr) => rangeStr.split('-').map((n) => parseInt(n));

const parseRules = (rulesStr) => {
  return rulesStr.split('\n').reduce((rules, ruleStr) => {
    const [
      ,
      type,
      firstRangeStr,
      secondRangeStr,
    ] = /(.+): (\d+-\d+) or (\d+-\d+)/.exec(ruleStr);
    rules[type] = [parseRange(firstRangeStr), parseRange(secondRangeStr)];
    return rules;
  }, {});
};

const rules = parseRules(rulesStr);

const isValid = (value, rule) =>
  !!rule.find(([start, end]) => start <= value && value <= end);

const findInvalidValues = (values, rules) => {
  return values.filter((v) => {
    const ranges = [].concat(...Object.values(rules));
    return !isValid(v, ranges);
  });
};

const values = nearbyTicketsStr
  .replace(/\n/g, ',')
  .split(',')
  .map((n) => parseInt(n));
const invalidValues = findInvalidValues(values, rules);

const sum = (arr) => arr.reduce((a, b) => a + b, 0);

console.log('part1', sum(invalidValues));

const nearbyTickets = nearbyTicketsStr
  .split('\n')
  .map((t) => t.split(',').map((n) => parseInt(n)));

const validTickets = nearbyTickets.filter(
  (ticket) => !findInvalidValues(ticket, rules).length
);

const ruleTypes = Object.keys(rules);
const myTicket = myTicketStr.split(',').map((n) => parseInt(n));
const numPositions = myTicket.length;

const possibilities = {};

const range = (start, end) => {
  const r = [];
  for (let i = start; i < end; i++) {
    r.push(i);
  }
  return r;
};

ruleTypes.forEach((type) => {
  possibilities[type] = range(0, numPositions);
});

const knownTypes = [];
const knownPositions = [];

const applyKnownPos = (type, pos) => {
  console.log('applying known pos', type, pos);
  Object.entries(possibilities).forEach(([type2, positions]) => {
    if (type !== type2) {
      const originalLength = possibilities[type2].length;
      possibilities[type2] = possibilities[type2].filter((n) => n !== pos);
      if (possibilities[type2].length === 1 && originalLength !== 1) {
        const newKnownPos = possibilities[type2][0];
        applyKnownPos(type2, newKnownPos);
      }
    }
  });
};

while (validTickets.length) {
  const ticket = validTickets.pop();
  Object.entries(possibilities).forEach(([type, positions]) => {
    if (positions.length === 1) return;
    possibilities[type] = possibilities[type].filter((pos) => {
      return isValid(ticket[pos], rules[type]);
    });
    if (possibilities[type].length === 1) {
      const knownPos = possibilities[type][0];
      applyKnownPos(type, knownPos);
    }
  });
}

console.log('possibilities', possibilities);

const result = Object.entries(possibilities).reduce((result, [type, [pos]]) => {
  if (type.startsWith('departure')) {
    result *= myTicket[pos];
  }
  return result;
}, 1);

console.log('part2', result);
