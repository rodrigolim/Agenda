const express = require('express');
const router = express.Router();
const Agendamento = require('../models/Agendamento');
const mongoose = require('mongoose'); // Importe o mongoose
const twilio = require('twilio');


// Configuração do Twilio
const accountSid = 'ACedf51509da1dcc334cadefc9239f892f';
const authToken = 'f723557a397a6b33e3cb0d47de431133';
const client = new twilio(accountSid, authToken);


// Endpoint para receber mensagens do WhatsApp
router.post('/webhook', (req, res) => {
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





// Função para gerar um _id personalizado
function generateCustomId() {
    // Gere um timestamp UNIX em milissegundos
    const timestamp = new Date().getTime();
  
    // Gere um número aleatório de 4 dígitos
    const random = Math.floor(Math.random() * 10000);
  
    // Combine o timestamp e o número aleatório para criar um ID personalizado
    const customId = `${timestamp}${random}`;
  
    return customId;
  }

// Rota de teste para verificar a conexão com o banco de dados
router.get('/test-db-connection', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    if (dbStatus === 1) {
      res.status(200).json({ message: 'Conexão com o banco de dados estabelecida com sucesso.' });
    } else {
      res.status(500).json({ message: 'Erro na conexão com o banco de dados.' });
    }
  });

// Rota para listar todos os agendamentos
router.get('/agendamentos', async (req, res) => {
    try {
      // Consulta o banco de dados para obter todos os agendamentos
      const agendamentos = await Agendamento.find();
  
      res.json(agendamentos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao listar os agendamentos.' });
    }
  });


// Rota para consultar agendamento por data e horário
router.get('/agendamentos/:date/:time', async (req, res) => {
    try {
      const date = req.params.date;
      const time = req.params.time;
  
      // Consulta o banco de dados para encontrar o agendamento com a data e horário especificados
      const agendamento = await Agendamento.findOne({ date, time });
  
      if (!agendamento) {
        return res.status(404).json({ message: 'Agendamento não encontrado.' });
      }
  
      res.json(agendamento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao consultar o agendamento.' });
    }
  });

  // Rota para consultar agendamento por id
router.get('/agendamentos/:id', async (req, res) => {
    try {
        const idString = req.params.id;
  
        // Consulta o banco de dados para encontrar o agendamento com a data e horário especificados
        const agendamento = await Agendamento.findById(idString);
    
        if (!agendamento) {
          return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }
  
      res.json(agendamento);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao consultar o agendamento.' });
    }
  });

// Rota para criar um novo agendamento
router.post('/agendamentos', async (req, res) => {
  try {

    const customId = generateCustomId();

    // Verifica se já existe um agendamento com a mesma data e hora
    const existeAgendamento = await Agendamento.findOne({      
      date: req.body.date,
      time: req.body.time,
    });

    if (existeAgendamento) {
      return res.status(400).json({ message: 'Já existe um agendamento para esta data e hora.' });
    }

    // Cria um novo agendamento usando os dados do corpo da solicitação (req.body)
    const novoAgendamento = new Agendamento({
        _id: customId,
        date: req.body.date,
        time: req.body.time,
        clientName: req.body.clientName,
      });

    await novoAgendamento.save();

    res.status(201).json(novoAgendamento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar o agendamento.' });
  }
});

router.delete('/agendamentos/:id', async (req, res) => {
    try {
        
      const idString = req.params.id;
  
      // Consulta o banco de dados para encontrar o agendamento com a data e horário especificados
      const agendamento = await Agendamento.findByIdAndDelete(idString);
  
      if (!agendamento) {
        return res.status(404).json({ message: 'Agendamento não encontrado.' });
      }

      res.json({ message: 'Agendamento excluído com sucesso.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao excluir o agendamento.' });
    }
  });

module.exports = router;
