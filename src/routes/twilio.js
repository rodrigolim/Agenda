require('dotenv').config(); // Carregue as variáveis de ambiente do arquivo .env

const express = require('express');
const router = express.Router();
const twilio = require('twilio');


// Configuração do Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const senderPhoneNumber = process.env.SENDER_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);


// Endpoint para receber mensagens do WhatsApp
router.post('/twilio/webhook', (req, res) => {
  const incomingMessage = req.body.Body;

  console.log(incomingMessage)
  console.log(req.body)

  // Lógica do chatbot: responder à pergunta "Olá" com uma saudação
  if (incomingMessage.toLowerCase() === 'olá') {
    const responseMessage = 'Olá! Como posso ajudar você hoje?';
    sendWhatsAppMessage(senderPhoneNumber, responseMessage);
  } else {
    const responseMessage = 'Desculpe, não entendi. Por favor, faça outra pergunta.';
    sendWhatsAppMessage(senderPhoneNumber, responseMessage);
  }

  res.sendStatus(200);
});

// Função para enviar mensagens de volta para o WhatsApp
function sendWhatsAppMessage(to, message) {
  client.messages.create({
    body: message,
    from: 'whatsapp:'+twilioPhoneNumber, // Deve ser um número do Twilio configurado no WhatsApp Business API
    to: 'whatsapp:'+to    
  })
  .then(message => console.log(`Mensagem enviada com sucesso: ${message.sid}`))
  .catch(error => console.error(`Erro ao enviar mensagem: ${error}`));

}

module.exports = router;