const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

const contatos = require('./contatos.js');

const caminhoImagem = path.resolve(__dirname, 'img', 'Cartao_campneus.png');

if (!fs.existsSync(caminhoImagem)) {
    console.error('❌ Imagem não encontrada:', caminhoImagem);
    process.exit(1);
}

let enviados = [];
const caminhoEnviados = path.resolve(__dirname, 'enviados.json');
if (fs.existsSync(caminhoEnviados)) {
    enviados = JSON.parse(fs.readFileSync(caminhoEnviados));
}

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Bot conectado com sucesso!');
    console.log('Usando imagem:', caminhoImagem);

    const media = MessageMedia.fromFilePath(caminhoImagem);
    const mensagem = 'Olá! Esta é uma mensagem automática com uma imagem!';

    for (const numero of contatos) {
        if (!enviados.includes(numero)) {
            try {
                // Envia a mensagem primeiro
                await client.sendMessage(numero + '@c.us', mensagem);
                // Depois envia a imagem
                await client.sendMessage(numero + '@c.us', media);

                console.log(`✅ Mensagem enviada para ${numero}`);

                enviados.push(numero);
                fs.writeFileSync(caminhoEnviados, JSON.stringify(enviados, null, 2));

                // Aguarda 5 minutos antes do próximo envio
                await new Promise(resolve => setTimeout(resolve, 300000));
            } catch (error) {
                console.error(`❌ Erro ao enviar para ${numero}:`, error.message);
            }
        } else {
            console.log(`⏩ ${numero} já recebeu. Pulando...`);
        }
    }

    console.log('📨 Envio finalizado!');
    process.exit(0);
});

client.initialize();
