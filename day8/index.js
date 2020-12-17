const { readFileSync } = require('fs');

const rows = readFileSync('./input.txt', 'utf8')
  .split('\n')
  .filter((r) => !!r);

const instrs = rows.map((row) => {
  const [command, arg] = row.split(' ');
  return [command, parseInt(arg), false];
});

let accumulator = 0;
let instrPtr = 0;

const runInstr = (instr) => {
  const [command, arg] = instr;
  switch (command) {
    case 'acc':
      accumulator += arg;
      instrPtr++;
      break;
    case 'jmp':
      instrPtr += arg;
      break;
    case 'nop':
      instrPtr++;
      break;
  }
  instr[2] = true;
};

// Part 1
/*
 * let running = true;
 * while (running) {
 *   const instr = instrs[instrPtr];
 *   if (instr[2]) {
 *     running = false;
 *   } else {
 *     runInstr(instr);
 *   }
 * }
 *
 * console.log('accumulator', accumulator); */

// part 2
for (let i = 0; i < instrs.length; i++) {
  const modifiedInstrs = instrs.map(([cmd, arg]) => [cmd, arg, false]);
  if (modifiedInstrs[i][0] !== 'acc') {
    if (modifiedInstrs[i][0] === 'jmp') {
      modifiedInstrs[i] = ['nop', modifiedInstrs[i][1], false];
    } else if (modifiedInstrs[i][0] === 'nop') {
      modifiedInstrs[i] = ['jmp', modifiedInstrs[i][1], false];
    }
    accumulator = 0;
    instrPtr = 0;
    let running = true;
    let infLoop = false;
    while (running) {
      const instr = modifiedInstrs[instrPtr];
      if (typeof instr === 'undefined') {
        running = false;
      } else if (instr[2]) {
        infLoop = true;
        running = false;
      } else {
        runInstr(instr);
      }
    }
    if (!infLoop) break;
  }
}

console.log('accumulator', accumulator);
