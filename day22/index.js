const { readFileSync } = require('fs');

const playerStrs = readFileSync('./input.txt', 'utf8').trim().split('\n\n');

const parseDeck = (pStr) =>
  pStr
    .split('\n')
    .slice(1)
    .map((n) => parseInt(n));

const [p1Deck, p2Deck] = playerStrs.map(parseDeck);

const playRound = () => {
  const p1Card = p1Deck.shift();
  const p2Card = p2Deck.shift();
  if (p1Card > p2Card) {
    // p1 wins
    p1Deck.push(p1Card, p2Card);
  } else {
    // p2 wins
    p2Deck.push(p2Card, p1Card);
  }
};

while (p1Deck.length && p2Deck.length) {
  playRound();
}

const score = (deck) =>
  deck.reduce((score, card, i) => score + card * (deck.length - i), 0);

const winningDeck = (p1Deck, p2Deck) =>
  [p1Deck, p2Deck].sort((a, b) => b.length - a.length)[0];

const winningScore = score(winningDeck(p1Deck, p2Deck));

console.log('part1', winningScore);

const recCombat = (deck1, deck2) => {
  const p1Deck = [...deck1];
  const p2Deck = [...deck2];

  const previousConfigs = new Set();

  while (p1Deck.length && p2Deck.length) {
    const config = p1Deck.join() + ':' + p2Deck.join();
    if (previousConfigs.has(config)) {
      return [p1Deck.concat(p2Deck), []];
    } else {
      previousConfigs.add(config);
    }

    const p1Card = p1Deck.shift();
    const p2Card = p2Deck.shift();

    if (p1Card <= p1Deck.length && p2Card <= p2Deck.length) {
      const subGameResult = recCombat(
        p1Deck.slice(0, p1Card),
        p2Deck.slice(0, p2Card)
      );
      if (subGameResult[0].length > subGameResult[1].length) {
        p1Deck.push(p1Card, p2Card);
      } else {
        p2Deck.push(p2Card, p1Card);
      }
    } else {
      if (p1Card > p2Card) {
        p1Deck.push(p1Card, p2Card);
      } else {
        p2Deck.push(p2Card, p1Card);
      }
    }
  }

  return [p1Deck, p2Deck];
};

const [finalDeck1, finalDeck2] = recCombat(...playerStrs.map(parseDeck));

console.log('part2', score(winningDeck(finalDeck1, finalDeck2)));
