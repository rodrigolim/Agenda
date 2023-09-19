const express = require('express');
const router = express.Router();

const { iniciarDia, getAgendamentos, getAgendamentosPorDataHora, getAgendamentosPorId, postAgendamento, deleteAgendamento } = require('../controllers/agendamentoController.js');

router.post('/api/iniciar-dia', iniciarDia);
router.get('/api/agendamentos', getAgendamentos);
router.get('/api/agendamentos/:date/:time', getAgendamentosPorDataHora);
router.get('/api/agendamentos/:id', getAgendamentosPorId);
router.post('/api/agendamentos', postAgendamento);
router.delete('/api/agendamentos/:id', deleteAgendamento);

module.exports = router;
