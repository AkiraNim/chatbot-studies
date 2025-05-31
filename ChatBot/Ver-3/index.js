const fs = require('fs'); // Importa o módulo de manipulação de arquivos
const phoneNumbersList = require('./phoneList'); // Importa a lista externa

const phoneNumbers = []; // Array para armazenar os números formatados

function formatPhoneNumber(phone) {
  // Remove o caractere '+' se existir
  phone = phone.replace(/^\+/, '');

  const regex = /^55(\d{2})(\d{8,9})$/; // Captura o DDD e os dígitos do número

  const match = phone.match(regex);
  if (!match) return null; // Retorna nulo se o número não estiver no formato esperado

  let ddd = match[1];
  let number = match[2];

  // Se o número tiver 9 dígitos, remover o primeiro dígito
  if (number.length === 9) {
    number = number.substring(1);
  }

  const formattedPhone = `55${ddd}${number}`;
  phoneNumbers.push(formattedPhone); // Adiciona ao array

  return formattedPhone;
}

// Processar todos os números da lista externa
phoneNumbersList.forEach(formatPhoneNumber);

// Gerar JSON com os números formatados
const jsonOutput = JSON.stringify({ phoneNumbers }, null, 2);

// Salvar JSON em um arquivo
fs.writeFileSync('output.json', jsonOutput, 'utf-8');

console.log('Arquivo JSON salvo como output.json');
