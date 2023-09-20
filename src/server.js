require('dotenv').config(); // Carregue as variáveis de ambiente do arquivo .env

const express = require('express');
const app = express();
const routesApi = require('./routes/api');
const routesTwilio = require('./routes/twilio');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('../swagger.json');

const connectDB = require('./database/connect.js'); 

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/docs',  swaggerUi.serve,  swaggerUi.setup(swaggerDocs));
app.use('/', routesApi);
app.use('/', routesTwilio);

app.get('/', (req, res) => {
  const responseMessage = 'Servidor Online.';
  console.log(responseMessage);
  res.status(200).json({ message: responseMessage });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
