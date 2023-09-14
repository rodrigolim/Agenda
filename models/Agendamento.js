const mongoose = require('mongoose');
// Defina o esquema do modelo de agendamento
const agendamentoSchema = new mongoose.Schema({
    _id: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    // Outros campos relevantes
  });
  

  // Crie e exporte o modelo de agendamento
  const Agendamento = mongoose.model('Agendamento', agendamentoSchema);
  
  module.exports = Agendamento;
