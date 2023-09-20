require('dotenv').config(); // Carregue as variáveis de ambiente do arquivo .env
const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger.json'

const endpointsFiles = ['./src/routes/api', './src/routes/twilio']

const port = process.env.PORT || 3000;

const doc = {
    info: {
      title: 'Exemplo de API Swagger com Node.js',
      description: 'Documentação da API Swagger com Node.js',
      version: '1.0.0',
    },
    host: `localhost:${port}`, // Host onde o servidor Express está rodando
    basePath: '/', // Caminho base da API
  };

swaggerAutogen(outputFile, endpointsFiles, doc)