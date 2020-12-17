const { readFileSync } = require('fs');

const rawInput = readFileSync('./input.txt', 'utf8');

const sections = rawInput.split('\n\n');

const parseSection = (section) => {
  return section.split(/\s/).reduce((r, field) => {
    const [key, value] = field.split(':');
    r[key] = value;
    return r;
  }, {});
};

const passports = sections.map(parseSection);

const isByrValid = (passport) => {
  return (
    /^\d{4}$/.test(passport.byr) &&
    Number(passport.byr) >= 1920 &&
    Number(passport.byr) <= 2002
  );
};

const isIyrValid = ({ iyr }) =>
  /^\d{4}$/.test(iyr) && Number(iyr) >= 2010 && Number(iyr) <= 2020;

const isEyrValid = ({ eyr }) =>
  /^\d{4}$/.test(eyr) && Number(eyr) >= 2020 && Number(eyr) <= 2030;

const isHgtValid = ({ hgt }) => {
  const matches = /^(\d+)(cm|in)$/.exec(hgt);
  if (!matches) return false;
  const [_, num, unit] = matches;
  switch (unit) {
    case 'cm':
      return Number(num) >= 150 && Number(num) <= 193;
    case 'in':
      return Number(num) >= 59 && Number(num) <= 76;
    default:
      return false;
  }
};

const isHclValid = ({ hcl }) => /^#[0-9a-f]{6}$/.test(hcl);

const isEclValid = ({ ecl }) => /^(amb|blu|brn|gry|grn|hzl|oth)$/.test(ecl);

const isPidValid = ({ pid }) => /^\d{9}$/.test(pid);

const isValid = (passport) => {
  return (
    isByrValid(passport) &&
    isIyrValid(passport) &&
    isEyrValid(passport) &&
    isHgtValid(passport) &&
    isHclValid(passport) &&
    isEclValid(passport) &&
    isPidValid(passport)
  );
};

const validPassports = passports.filter(isValid).length;
console.log('validPassports', validPassports);
