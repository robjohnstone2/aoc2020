const { readFileSync } = require('fs');

const [rulesStr, messagesStr] = readFileSync('./input.txt', 'utf8').split(
  '\n\n'
);

const parseRules = (str) =>
  str.split('\n').reduce((rules, ruleStr) => {
    const [id, str] = ruleStr.split(': ');
    rules[id] = str;
    return rules;
  }, {});

const rules = parseRules(rulesStr);

const buildPattern = (rule) => {
  if (rule === '42 | 42 8') return `(${buildPattern(rules[42])})+`;
  if (rule === '42 31 | 42 11 31') {
    const p42 = buildPattern(rules[42]);
    const p31 = buildPattern(rules[31]);
    let pArr = [];
    for (let i = 1; i < 10; i++) {
      const p42s = p42.repeat(i);
      const p31s = p31.repeat(i);
      pArr.push(p42s + p31s);
    }
    return `(${pArr.join('|')})`;
  }
  const clauses = rule.split(' | ');
  const subPatterns = clauses.map((clause) =>
    clause.split(' ').reduce((pattern, section) => {
      if (/[a-z]+/.test(section)) {
        return pattern + section.replace(/"/g, '');
      } else if (/\d+/.test(section)) {
        return pattern + buildPattern(rules[parseInt(section)]);
      }
    }, '')
  );
  const pattern = subPatterns.join('|');
  return subPatterns.length === 1 ? pattern : '(' + pattern + ')';
};

const pattern = buildPattern(rules[0]);

const re = new RegExp('^' + pattern + '$');

const getMatchingMsgs = (messageStr, re) =>
  messagesStr
    .trim()
    .split('\n')
    .filter((msg) => re.test(msg));

console.log('part1', getMatchingMsgs(messagesStr, re).length);

rules[8] = '42 | 42 8';
rules[11] = '42 31 | 42 11 31';
const pattern2 = buildPattern(rules[0]);
const re2 = new RegExp('^' + pattern2 + '$');
console.log('part2', getMatchingMsgs(messagesStr, re2).length);
