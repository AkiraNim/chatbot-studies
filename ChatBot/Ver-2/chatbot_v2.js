const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot conectado com sucesso!');
});

client.on('message', async msg => {
    if (msg.body === '!menu') {
        await msg.reply('Escolha uma opção:\n1 - Ver horário\n2 - Falar com atendente');
    }

    if (msg.body === '1') {
        await msg.reply('Estamos abertos das 8h às 18h.');
    }

    if (msg.body === '2') {
        await msg.reply('Aguarde um momento, um atendente irá te chamar.');
    }
});

client.initialize();
