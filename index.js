require('dotenv').config(); // Carregue as variáveis de ambiente do arquivo .env

const express = require('express');
const app = express();
const apiRoutes = require('./routes/api');
const db = require('./db'); // Importe a conexão com o banco de dados

app.use(express.json());
app.use('/api/', apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
