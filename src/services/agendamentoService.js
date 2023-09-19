const Agendamento = require('../models/Agendamento');



// Função para buscar agendamentos
async function getAgendamentos() {
  try {
    const agendamentos = await Agendamento.find(); // Busque todos os objetos de Agendamento
    return agendamentos;
  } catch (error) {
    throw new Error(error.message);
  }
}

// Função para buscar agendamento por data e hora
async function getAgendamentosPorDataHora(date, time) {
  try {
    const agendamento = await Agendamento.findOne({ date, time }); // Busque objetos de Agendamento com a data e hora especificadas
    return agendamento;
  } catch (error) {
    throw new Error(error.message);
  }
}


// Função para buscar agendamento por ID
async function getAgendamentosPorId(id) {
  try {
    const agendamento = await Agendamento.findById(id); 
    return agendamento;
  } catch (error) {
    throw new Error(error.message);
  }
}


// Função para buscar e deletar o agendamento por ID
async function deleteAgendamentosPorId(id) {
  try {
    const agendamento = await Agendamento.findByIdAndDelete(id); 
    return agendamento;
  } catch (error) {
    throw new Error(error.message);
  }
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


// Função para buscar agendamento por data e hora
async function postAgendamento(date, time, clientName, clientPhone) {
  try {
    // Verifica se já existe um agendamento com a mesma data e hora
    const existeAgendamento = await getAgendamentosPorDataHora(date, time);

    if (existeAgendamento) {
      throw new Error('Já existe um agendamento para esta data e hora.');
    }

    const customId = generateCustomId();
    const novoAgendamento = new Agendamento({
      _id: customId,
      date: date,
      time: time,
      clientName: clientName,
      clientPhone: clientPhone,
    });

    await novoAgendamento.save();

    return novoAgendamento;
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = { getAgendamentos, getAgendamentosPorDataHora, getAgendamentosPorId, postAgendamento, deleteAgendamentosPorId };