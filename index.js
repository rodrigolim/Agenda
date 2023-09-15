require('dotenv').config(); // Carregue as variáveis de ambiente do arquivo .env

const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');
//const db = require('./db'); // Importe a conexão com o banco de dados
const bodyParser = require('body-parser');
const twilio = require('twilio');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
//app.use('/api/', apiRoutes);


// Configuração do Twilio
const accountSid = 'ACedf51509da1dcc334cadefc9239f892f';
const authToken = 'f723557a397a6b33e3cb0d47de431133';
const client = new twilio(accountSid, authToken);

// Endpoint para receber mensagens do WhatsApp
app.post('/', (req, res) => {
  const responseMessage = 'Servidor Online.';
  console.log(responseMessage);
  res.status(200).json({ message: responseMessage });
});

// Endpoint para receber mensagens do WhatsApp
app.post('/webhook', (req, res) => {
  const incomingMessage = req.body.Body;
  const senderPhoneNumber = req.body.From;

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
    from: 'whatsapp:+14155238886', // Deve ser um número do Twilio configurado no WhatsApp Business API
    to: 'whatsapp:'+to    
  //  to: 'whatsapp:+553598539000'
  })
  .then(message => console.log(`Mensagem enviada com sucesso: ${message.sid}`))
  .catch(error => console.error(`Erro ao enviar mensagem: ${error}`));

}


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
