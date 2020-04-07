//this runs on server , will require puppeteer
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const puppeteer = require('puppeteer');
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
  //call puppeteer function here,
  //also hardcode the URL before dynamic.
  let output = await scrapeData();
  console.log('DATA HAS BEEN SCRAPED');
  res.status(200).send(output);
});

let PORT = 3000;

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
})
