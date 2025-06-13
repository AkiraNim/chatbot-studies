const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const contacts = require('./phone-list-normalized.js');
const messageText = require('./message.js');

let sent = [];
const sentFilePath = path.resolve(__dirname, 'sent.json');

if (fs.existsSync(sentFilePath)) {
    sent = JSON.parse(fs.readFileSync(sentFilePath));
}

const client = new Client({
    authStrategy: new LocalAuth()
});

let myNumber = '';

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Bot connected');
    myNumber = client.info.wid._serialized;

    for (const number of contacts) {
        if (!sent.includes(number)) {
            try {
                await client.sendMessage(number + '@c.us', messageText);
                console.log(`✅ Message sent to ${number}`);

                sent.push(number);
                fs.writeFileSync(sentFilePath, JSON.stringify(sent, null, 2));

                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`❌ Failed to send to ${number}:`, error.message);
            }
        } else {
            console.log(`⏩ ${number} already received. Skipping...`);
        }
    }

    console.log('🚀 Listening for replies...');
});

client.on('message', async msg => {
    const sender = msg.from.replace('@c.us', '');

    if (contacts.includes(sender)) {
        console.log(`📩 Message received from ${sender}: "${msg.body}"`);

        try {
            const forward = `📥 ${sender} replied: "${msg.body}"`;
            await client.sendMessage(myNumber, forward);
            console.log(`🔁 Forwarded to own number: ${myNumber}`);
        } catch (err) {
            console.error('❌ Failed to forward message:', err.message);
        }
    }
});

client.initialize();
