const { readFileSync } = require('fs');

const rows = readFileSync('./input.txt', 'utf8').trim().split('\n');

const matchers = {
  num: /^\s*\d+/,
  leftParen: /^\s*\(/,
  rightParen: /^\s*\)/,
  sum: /^\s*\+/,
  product: /^\s*\*/,
};

const getToken = (str) => {
  const matcher = Object.entries(matchers).find(([type, re]) => re.test(str));
  if (!matcher) throw `Syntax Error: ${str}`;
  const [type, re] = matcher;
  const tokenStr = re.exec(str)[0];
  return {
    type,
    value: type === 'num' ? parseInt(tokenStr) : tokenStr,
    length: tokenStr.length,
  };
};

const tokeniseExpr = (str) => {
  const tokens = [];
  while (str.length) {
    const token = getToken(str);
    str = str.slice(token.length);
    tokens.push(token);
  }
  return tokens;
};

const getSubExprTokens = (tokens) => {
  let depth = 1;
  const subExprTokens = [];
  while (depth > 0) {
    const token = tokens.pop();
    if (token.type === 'rightParen') depth++;
    else if (token.type === 'leftParen') depth--;
    subExprTokens.unshift(token);
  }
  subExprTokens.shift(); // discard final closing paren
  return subExprTokens;
};

const evalTokenisedExpr = (tokens) => {
  let firstToken = tokens.pop(); // we need to work in reverse
  if (firstToken.type === 'num') {
    const nextToken = tokens.pop();
    if (!nextToken) {
      return firstToken.value;
    } else if (nextToken.type === 'sum') {
      return firstToken.value + evalTokenisedExpr(tokens);
    } else if (nextToken.type === 'product') {
      return firstToken.value * evalTokenisedExpr(tokens);
    } else throw `Syntax Error: Unexpected token ${firstToken.type}`;
  } else if (firstToken.type === 'rightParen') {
    const subExprTokens = getSubExprTokens(tokens);
    const evaluatedToken = {
      type: 'num',
      value: evalTokenisedExpr(subExprTokens),
      length: null,
    };
    tokens.push(evaluatedToken);
    return evalTokenisedExpr(tokens);
  } else throw `Syntax Error: Unexpected token ${firstToken.type}`;
};

const evalExpr = (input) => evalTokenisedExpr(tokeniseExpr(input));

console.log(
  'part1',
  rows.map(evalExpr).reduce((a, b) => a + b)
);

const evalTokenisedExpr2 = (tokens, greedy = true) => {
  // console.log(tokens.map((t) => t.value).join(' '));
  let firstToken = tokens.pop(); // we need to work in reverse
  if (firstToken.type === 'num') {
    if (!greedy) {
      return firstToken.value;
    }
    const nextToken = tokens.pop();
    if (!nextToken) {
      return firstToken.value;
    } else if (nextToken.type === 'rightParen') {
      return evalTokenisedExpr2([nextToken, ...tokens]);
    } else if (nextToken.type === 'sum') {
      const rightValue = evalTokenisedExpr2(tokens, false);
      const evaluatedToken = {
        type: 'num',
        value: firstToken.value + rightValue,
        length: null,
      };
      tokens.push(evaluatedToken);
      return evalTokenisedExpr2(tokens);
    } else if (nextToken.type === 'product') {
      const rightValue = evalTokenisedExpr2(tokens);
      return firstToken.value * rightValue;
    } else throw `Syntax Error: Unexpected token ${firstToken.type}`;
  } else if (firstToken.type === 'rightParen') {
    const subExprTokens = getSubExprTokens(tokens);
    const evaluatedToken = {
      type: 'num',
      value: evalTokenisedExpr2(subExprTokens),
      length: null,
    };
    tokens.push(evaluatedToken);
    return evalTokenisedExpr2(tokens, greedy);
  } else throw `Syntax Error: Unexpected token ${firstToken.type}`;
};

const evalExpr2 = (input) => evalTokenisedExpr2(tokeniseExpr(input));

console.log(
  'part2',
  rows.map(evalExpr2).reduce((a, b) => a + b)
);
