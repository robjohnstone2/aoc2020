const { readFileSync } = require('fs');

const rows = readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n')
  .map((r) => r.trim());

const parseRow = (row) => {
  if (row.startsWith('mask')) {
    return ['mask', row.split(' = ')[1]];
  } else {
    const [, addr, value] = /^mem\[(\d+)\] = (\d+)$/.exec(row);
    return ['mem', addr, value];
  }
};

const instrs = rows.map(parseRow);

const applyMask = (mask, value) => {
  const changes = mask.split('').reduce((acc, char, i) => {
    if (char !== 'X') {
      acc[i] = char;
    }
    return acc;
  }, []);
  const valueArr = Number(value)
    .toString(2)
    .padStart(mask.length, '0')
    .split('');
  const maskedValueString = valueArr.reduce((acc, [char, offset], i) => {
    return acc + (changes[i] || char);
  }, 0);
  return parseInt(maskedValueString, 2);
};

const eval = (instrs) => {
  let mask = '';
  let memory = [];

  instrs.forEach((instr) => {
    const cmd = instr[0];
    if (cmd === 'mask') {
      mask = instr[1];
    } else {
      memory[Number(instr[1])] = applyMask(mask, instr[2]);
    }
  });

  return memory;
};

const part1mem = eval(instrs);

const sum = (mem) => mem.filter((n) => !!n).reduce((total, n) => total + n);
console.log('part1', sum(part1mem));

const decode = (mask, addr) => {
  const initialAddr = addr.toString(2).padStart(mask.length, '0');
  let decodedAddr = '';
  for (let i = 0; i < mask.length; i++) {
    if (mask[i] === '0') {
      decodedAddr += initialAddr[i];
    } else {
      decodedAddr += mask[i];
    }
  }
  return decodedAddr;
};

const expandAddresses = (decodedAddr) => {
  const numXs = decodedAddr.split('X').length - 1;
  const decodedAddrArr = decodedAddr.split('');
  const combinations = Math.pow(2, numXs);
  const addrs = [];
  for (let i = 0; i < combinations; i++) {
    const xValues = i.toString(2).padStart(numXs, '0').split('');
    const addr = decodedAddrArr.reduce((acc, char) => {
      if (char === 'X') {
        acc += xValues.shift();
      } else {
        acc += char;
      }
      return acc;
    }, '');
    addrs.push(addr);
  }
  return addrs;
};

const eval2 = (instrs) => {
  let mask = '';
  let memory = {};

  instrs.forEach((instr, i) => {
    const cmd = instr[0];
    if (cmd === 'mask') {
      mask = instr[1];
    } else {
      const decoded = decode(mask, Number(instr[1]));
      const addrs = expandAddresses(decoded);
      addrs.forEach((addr) => (memory[addr] = Number(instr[2])));
    }
  });

  return memory;
};

const part2mem = eval2(instrs);
console.log('part2', sum(Object.values(part2mem)));
