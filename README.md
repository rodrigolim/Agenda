
# Agenda
CRUD com Node.JS, express, body-parser, dotenv, mongoose, nodemon e MongoDB

## Pré-requisitos
NPM, YARN, PostgreSQL

## Configurar as Váriaveis de Ambiente
```
MONGODB_URI='mongodb://localhost:27017/agenda'
PORT=3000
```

## Instalação
- via CMD, localize a pasta root do projeto e execute:
```
npm install
```
- após, na pasta root do projeto, inicie um servidor local, por exemplo:
```
npm start
```
- no browser, abra o endereço abaixo e verifique o funcionamento da API
```
localhost:3000/
```


## Modelo de Json para POST
```
{
  "date": "2023-09-14T00:00:00.000Z",
  "time": "15:00",
  "clientName": "João Silva"
}
```