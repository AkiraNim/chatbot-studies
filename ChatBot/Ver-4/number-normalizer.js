const fs = require('fs');
const rawPhoneList = require('./phone-list-normalizer'); 
const normalizedSet = new Set();

function normalizePhoneNumber(phone) {
  phone = phone.replace(/^\+/, '');
  const regex = /^55(\d{2})(\d{8,9})$/;
  const match = phone.match(regex);
  if (!match) return null;

  let areaCode = match[1];
  let number = match[2];

  if (number.length === 9) {
    number = number.substring(1);
  }

  const normalized = `55${areaCode}${number}`;
  normalizedSet.add(normalized);
  return normalized;
}

rawPhoneList.forEach(normalizePhoneNumber);

const normalizedNumbers = Array.from(normalizedSet);
const output = `module.exports = ${JSON.stringify(normalizedNumbers, null, 2)};\n`;
fs.writeFileSync('phone-list-normalized.js', output, 'utf-8');

console.log('Normalized phone numbers saved to phone-list-normalized.js');
