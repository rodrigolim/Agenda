require('dotenv').config(); // Carregue as variáveis de ambiente do arquivo .env

const express = require('express');
const router = express.Router();
const twilio = require('twilio');


// Configuração do Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);


// Endpoint para receber mensagens do WhatsApp
router.post('/twilio/webhook', (req, res) => {

    //console.log(req.body);

    const { Body, From, Author } = req.body

    const senderPhoneNumber = (typeof From === 'undefined')  ? Author : From
  
    let text = Body.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
  
    // Lógica do chatbot: responder à pergunta "Olá" com uma saudação
    if (text.match('ola')) {
      const responseMessage = 'Olá! Como posso ajudar você hoje?';
      sendWhatsAppMessage(senderPhoneNumber, responseMessage);
    } else {
      const responseMessage = 'Desculpe, não entendi. Por favor, faça outra pergunta.';
      sendWhatsAppMessage(senderPhoneNumber, responseMessage);
    }
  
    res.status(200).send('Status: Successful ')

});

// Função para enviar mensagens de volta para o WhatsApp
function sendWhatsAppMessage(to, message) {
  client.messages.create({
    body: message,
    from: twilioPhoneNumber, // Deve ser um número do Twilio configurado no WhatsApp Business API
    to: to    
  })
  .then(message => console.log(`Mensagem enviada com sucesso: ${message.sid}`))
  .catch(error => console.error(`Erro ao enviar mensagem: ${error}`));

}

module.exports = router;