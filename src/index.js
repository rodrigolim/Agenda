require('dotenv').config(); // Carregue as variáveis de ambiente do arquivo .env

const express = require('express');
const app = express();
const routesApi = require('./routes/api');
const routesTwilio = require('./routes/twilio');

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', routesApi);
app.use('/', routesTwilio);

// Endpoint para receber mensagens do WhatsApp
app.get('/', (req, res) => {
  const responseMessage = 'Servidor Online.';
  console.log(responseMessage);
  res.status(200).json({ message: responseMessage });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
