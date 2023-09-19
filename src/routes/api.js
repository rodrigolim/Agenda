const express = require('express');
const router = express.Router();

const { getAgendamentos, getAgendamentosPorDataHora, getAgendamentosPorId, postAgendamento, deleteAgendamentosPorId } = require('../services/agendamentoService.js');



// Rota para listar todos os agendamentos
router.post('/api/iniciar-dia', async (req, res) => {
  try {

    const { data, intervaloEmMinutos, horarioInicial, horarioFinal } = req.body;

    if (!data || !intervaloEmMinutos || !horarioInicial || !horarioFinal) {
      throw new Error('Preencha todos os campos')
    }

    // Concatena a data com os horários para criar strings completas
    const horarioInicialCompleto = `${data}T${horarioInicial}`;
    const horarioFinalCompleto = `${data}T${horarioFinal}`;

    // Converte os horários de string para objetos Date
    const dataInicial = new Date(horarioInicialCompleto);
    const dataFinal = new Date(horarioFinalCompleto);

    // Verifica se os horários são válidos
    if (isNaN(dataInicial) || isNaN(dataFinal)) {
      throw new Error('Horários inválidos.')
    }

    // Calcula o intervalo em milissegundos
    const intervaloEmMillisegundos = intervaloEmMinutos * 60 * 1000;

    // Inicia o loop a partir do horário inicial
    let horarioAtual = dataInicial;

    // Loop enquanto o horário atual for menor que o horário final
    while (horarioAtual < dataFinal) {
      const ano = horarioAtual.getFullYear();
      const mes = String(horarioAtual.getMonth() + 1).padStart(2, '0'); // +1 porque janeiro é 0
      const dia = String(horarioAtual.getDate()).padStart(2, '0');
      const dataAtual = ano + '-' + mes + '-' + dia;

      const horaAtual = horarioAtual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });


      let agendamento = await getAgendamentosPorDataHora(dataAtual, horaAtual);

      if (!agendamento) {
        agendamento = await postAgendamento(dataAtual, horaAtual, '', '');

        console.log(agendamento);
      } 


      // Adiciona o intervalo em milissegundos ao horário atual
      horarioAtual = new Date(horarioAtual.getTime() + intervaloEmMillisegundos);
    }

    res.status(200).send('Status: Successful ')

  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message })
  }

});

// Rota para listar todos os agendamentos
router.get('/api/agendamentos', async (req, res) => {
  try {
    // Consulta o banco de dados para obter todos os agendamentos
    const agendamentos = await getAgendamentos();

    res.status(200).json(agendamentos);

  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message })
  }

});


// Rota para consultar agendamento por data e horário
router.get('/api/agendamentos/:date/:time', async (req, res) => {
  try {
    const date = req.params.date;
    const time = req.params.time;

    // Consulta o banco de dados para encontrar o agendamento com a data e horário especificados
    const agendamento = await getAgendamentosPorDataHora(date, time);

    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

   
    res.status(200).json(agendamento);

  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message })
  }

});

// Rota para consultar agendamento por id
router.get('/api/agendamentos/:id', async (req, res) => {
  try {
    const idString = req.params.id;

    if (!idString) {
      throw new Error('Obrigatório informar o ID')
    }

    // Consulta o banco de dados para encontrar o agendamento com a data e horário especificados
    const agendamento = await getAgendamentosPorId(idString);

    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.status(200).json(agendamento);

  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message })
  }
});

// Rota para criar um novo agendamento
router.post('/api/agendamentos', async (req, res) => {
  try {
    const { date, time, clientName, clientPhone } = req.body;

    if (!date || !time || !clientName || !clientPhone) {
      throw new Error('Preencha todos os campos')
    }

    const agendamento = await postAgendamento(date, time, clientName, clientPhone);

    res.status(201).json(agendamento);

  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message })
  }
});

router.delete('/api/agendamentos/:id', async (req, res) => {
  try {

    const idString = req.params.id;

    // Consulta o banco de dados para encontrar o agendamento com a data e horário especificados
    const agendamento = await deleteAgendamentosPorId(idString);

    if (!agendamento) {
      return res.status(404).json({ message: 'Agendamento não encontrado.' });
    }

    res.json({ message: 'Agendamento excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(409).json({ message: error.message })
  }
});

module.exports = router;
