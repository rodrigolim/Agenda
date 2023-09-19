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
    let responseMessage = '';
    console.log(req.body);

    const objeto1 = Singleton.getInstance();    


    const { Body, From, Author } = req.body


    objeto1.mensagem = objeto1.mensagem+' - '+Body;
    objeto1.imprimirMensagem();



    const senderPhoneNumber = (typeof From === 'undefined')  ? Author : From
  
    const text = Body.toLowerCase().replace(/[^\w\s]/gi, "").replace(/[\d]/gi, "").trim();
  
    const saudacaoRegex = /(ola|olá|bom|dia|oi)/i; // O "i" torna a regex insensível a maiúsculas/minúsculas
    const agendamentoRegex = /(marcar|agendamento|agendar)/i; 
    const cancelarRegex = /(cancelar|excluir|deletar)/i; 

    if (saudacaoRegex.test(text)) {
      objeto1.estado = Estados.SAUDACAO;
    } else if (agendamentoRegex.test(text)) {
      objeto1.estado = Estados.MARCAR;
    } else if (cancelarRegex.test(text)) {
      objeto1.estado = Estados.CANCELAR;
    } else if (objeto1.estado === Estados.NOME) {
      objeto1._nome = text;
      objeto1.estado = Estados.DATA;
    } else if (objeto1.estado === Estados.DATA) {
      objeto1._nome = text;
      objeto1.estado = Estados.HORA;
    }

    objeto1.imprimirMensagem();



    // Lógica do chatbot: responder à pergunta "Olá" com uma saudação
    //if (text.match(['ola','bom','dia'])) {
    switch (objeto1.estado) {
      case Estados.SAUDACAO:
        responseMessage = 'Olá, tudo bem? Sou o assistente virtual. Como posso ajudar você hoje? \n'+
                          'Para lhe auxiliar melhor, nos informe a opção desejada no Menu abaixo 👇: \n'+
                          ' \n1. - Marcar horário\n2. - Cancelar horário\n3.- Histórico de horário';
        break;
      case Estados.MARCAR: 
              responseMessage = 'Muito bem, me informe seu nome por favor.'; 
              objeto1.estado = Estados.NOME;
              break;
      case Estados.DATA: 
              responseMessage = 'Me informe a data pretendida.'; 
              break;
      case Estados.HORA: 
              responseMessage = 'Me informe a hora pretendida.'; 
              break;
      default: responseMessage = 'Desculpe, não entendi. Por favor, faça outra pergunta.';        
    }
  
    sendWhatsAppMessage(senderPhoneNumber, responseMessage);
    res.status(200).send('Status: Successful ')

});


// Enum para os estados
const Estados = {
  UNDEFINED: 'undefined',
  SAUDACAO: 'Saudação',
  MARCAR: 'Marcar',
  CANCELAR: 'Cancelar',
  DATA: 'Data',
  HORA: 'Hora',
  NOME: 'Nome',
};


// Objeto Singleton
class Singleton {
  constructor() {
    this._nome = '';
    this._estado = Estados.UNDEFINED; // Estado padrão
  }

  get nome() {
    return this._nome;
  }

  set nome(novoNome) {
    this._nome = novoNome;
  }

  get estado() {
    return this._estado;
  }

  set estado(novoEstado) {
    if (Object.values(Estados).includes(novoEstado)) {
      this._estado = novoEstado;
    } else {
      console.error('Estado inválido');
    }
  }

  imprimirMensagem() {
    console.log(`Nome: ${this._nome}`);
    console.log(`Estado: ${this._estado}`);
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Singleton();
    }
    return this.instance;
  }
}

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