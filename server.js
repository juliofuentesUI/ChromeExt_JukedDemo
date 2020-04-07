//this runs on server , will require puppeteer
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { scrapeData } = require('./serverScraper.js');

let app = express();

app.use(morgan('dev'));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

app.use(bodyParser());

app.all('/*',(req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});


app.get('/', async (req, res) => {
  let output = await scrapeData();
  res.status(200).send(output);
});

app.get('/lol', async (req, res) => {
  let output = await scrapeData('https://juked.gg/lol');
  res.status(200).send(output);
});

let PORT = 3000;

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
})
