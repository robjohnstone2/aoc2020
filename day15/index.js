// This takes about 10 minutes to run - clearly not the solution he's looking for!

const example = [0, 3, 6];
const input = [6, 3, 15, 13, 1, 0];

const occurrences = {};

const run = (input, numTurns) => {
  let turn = 0;
  let previous;
  let num;

  while (turn < numTurns) {
    if (turn % 100000 === 0)
      console.log(
        'turn',
        turn,
        'percent',
        ((100 * turn) / numTurns).toFixed(2)
      );
    const previousOccurrences = occurrences[previous];
    if (turn < input.length) {
      num = input[turn];
    } else if (previousOccurrences.length <= 1) {
      num = 0;
    } else {
      num = previousOccurrences[0] - previousOccurrences[1];
    }
    if (occurrences[num]) {
      occurrences[num].length > 1 && occurrences[num].pop();
      occurrences[num].unshift(turn);
    } else {
      occurrences[num] = [turn];
    }
    turn++;
    previous = num;
  }

  return num;
};

console.log('part1', run(input, 2020));
console.log('part2', run(input, 30000000));
