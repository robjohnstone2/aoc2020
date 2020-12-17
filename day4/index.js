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

// const isValid = (passport) => {
//   /* const fields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
//    * return fields.reduce((result, field) => result && !!passport[field], true); */
//   let valid = true;
//
//   const byr = parseInt(passport.byr);
//   if (Number.isNaN(byr)) valid = false;
//   if (!/^\d{4}$/.test(passport.byr) || byr < 1920 || byr > 2002) valid = false;
//
//   const iyr = parseInt(passport.iyr);
//   if (Number.isNaN(iyr)) valid = false;
//   if (!/^\d{4}$/.test(passport.iyr) || iyr < 2010 || iyr > 2020) valid = false;
//
//   const eyr = parseInt(passport.eyr);
//   if (Number.isNaN(eyr)) valid = false;
//   if (!/^\d{4}$/.test(passport.eyr) || eyr < 2020 || iyr > 2030) valid = false;
//
//   if (!/^\d+(cm|in)$/.test(passport.hgt)) valid = false;
//   const hgt = parseInt(passport.hgt);
//   if (Number.isNaN(hgt)) valid = false;
//   if (/cm$/.test(passport.hgt)) {
//     if (hgt < 150 || hgt > 193) valid = false;
//   } else if (/in$/.test(passport.hgt)) {
//     if (hgt < 59 || hgt > 76) valid = false;
//   } else valid = false;
//
//   if (!/^#[0-9a-f]{6}$/.test(passport.hcl)) valid = false;
//
//   if (!/^(amb|blu|brn|gry|grn|hzl|oth)$/.test(passport.ecl)) valid = false;
//
//   if (!/^\d{9}$/.test(passport.pid)) valid = false;
//
//   return valid;
// };

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
