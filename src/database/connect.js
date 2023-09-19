require('dotenv').config(); // Carregue as variáveis de ambiente do arquivo .env

const mongoose = require('mongoose');

const mongodbURI = process.env.MONGODB_URI;

mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Erro na conexão com o banco de dados:'));
//db.once('open', () => {
 // console.log('Conexão com o banco de dados estabelecida com sucesso.');
//});
