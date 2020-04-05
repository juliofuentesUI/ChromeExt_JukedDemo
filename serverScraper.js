//this runs on server , will require puppeteer
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const puppeteer = require('puppeteer');

const JUKED_URL = 'https://juked.gg/wc3';

async function scrapeData(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // await page.waitForNavigation({ waitUntil: "domcontentloaded"});
  await page.goto(JUKED_URL, { waitUntil: 'domcontentloaded'});
  const userAgent = await page.evaluate(() => navigator.userAgent);
  console.log('userAgent is :' , userAgent);
  await page.waitForXPath('/html/body/div[1]/div/div[3]/div[1]/div/div[2]/div[2]/div[1]/div[1]/img');
  const [el] = await page.$x('/html/body/div[1]/div/div[3]/div[1]/div/div[2]/div[2]/div[1]/div[1]/img');
  // const [el] = await page.$x('//*[@id="root"]/div/div[3]/div[1]/div/div[2]/div[2]/div[1]/div[1]/img');
  console.log('el', el);
  const src = await el.getProperty('src');
  const srcTxt = await src.jsonValue();

  console.log('srcText here : ', srcTxt);
  browser.close();
  return {srcTxt};
};

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
  console.log('this has to run AFTER scraping');
  res.status(200).send(output);
});

let PORT = 3000;

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
})
