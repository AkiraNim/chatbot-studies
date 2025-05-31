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
    const mensagem = `👋 Olá!`;

    const ultNumero = contatos[contatos.length - 1];

    for (const numero of contatos) {
        if (!enviados.includes(numero)) {
            try {
                await client.sendMessage(numero + '@c.us', mensagem);
                await client.sendMessage(numero + '@c.us', media);

                console.log(`✅ Mensagem enviada para ${numero}`);

                enviados.push(numero);
                fs.writeFileSync(caminhoEnviados, JSON.stringify(enviados, null, 2));

                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`❌ Erro ao enviar para ${numero}:`, error.message);
            }
        } else {
            console.log(`⏩ ${numero} já recebeu. Pulando...`);
        }
    }

    // Verifica se o último número foi enviado, aguarda 20 segundos, desloga e finaliza
    if (enviados.includes(ultNumero)) {
        console.log('⏳ Aguardando 120 segundos antes de encerrar...');
        await new Promise(resolve => setTimeout(resolve, 120000));
    }

    console.log('📨 Envio finalizado!');
    await client.logout();
    process.exit(0);
});

client.initialize();
