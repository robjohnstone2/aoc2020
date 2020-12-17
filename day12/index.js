const { readFileSync } = require('fs');

const input = readFileSync('./input.txt', 'utf8');

const instrs = input
  .trim()
  .split('\n')
  .map((r) => [r[0], parseInt(r.slice(1))]);

let pos = [0, 0];
let dirs = ['N', 'E', 'S', 'W'];
let dirIndex = 1;

let waypoint = [10, -1];

const getDir = () => dirs.slice(dirIndex)[0];

const cmds = {
  N: (dist) => (pos[1] -= dist),
  E: (dist) => (pos[0] += dist),
  S: (dist) => (pos[1] += dist),
  W: (dist) => (pos[0] -= dist),
  L: (degrees) => (dirIndex = (dirIndex - degrees / 90) % dirs.length),
  R: (degrees) => (dirIndex = (dirIndex + degrees / 90) % dirs.length),
  F: (dist) => cmds[getDir()](dist),
};

const followInstr = (cmds) => ([cmd, dist]) => cmds[cmd](dist);

const run = (cmds, instrs) => instrs.forEach(followInstr(cmds));

/* const run = (cmds, instrs) =>
 *   instrs.forEach((instr) => {
 *     followInstr(cmds)(instr);
 *     console.log(
 *       'instr',
 *       instr,
 *       'pos',
 *       pos,
 *       'dir',
 *       getDir(),
 *       'waypoint',
 *       waypoint
 *     );
 *   }); */

run(cmds, instrs);

const manhattan = () => Math.abs(pos[0]) + Math.abs(pos[1]);

console.log('part1', manhattan());

pos = [0, 0];

const part2cmds = {
  N: (dist) => (waypoint[1] -= dist),
  E: (dist) => (waypoint[0] += dist),
  S: (dist) => (waypoint[1] += dist),
  W: (dist) => (waypoint[0] -= dist),
  L: (degrees) => part2cmds['R'](360 - degrees),
  R: (degrees) => {
    for (let i = 0; i < degrees / 90; i++) {
      waypoint = [0 - waypoint[1], waypoint[0]];
    }
  },
  F: (dist) =>
    (pos = [pos[0] + dist * waypoint[0], pos[1] + dist * waypoint[1]]),
};

run(part2cmds, instrs);

console.log('part2', manhattan());
