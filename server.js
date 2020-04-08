const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const db = require('./database.js');

let app = express();

app.use(morgan('dev'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(bodyParser());

app.all('/*',(req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});


app.get('/csgo', async (req, res) => {
  // let output = await scrapeData('https://juked.gg/csgo');
  let output = await db.fetchUpcomingEvents('csgo');
  res.status(200).send(output);
});

app.get('/lol', async (req, res) => {
  // let output = await scrapeData('https://juked.gg/lol');
  let output = await db.fetchUpcomingEvents('lol');
  res.status(200).send(output);
});

let PORT = 3000;

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
})
