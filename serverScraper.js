//this runs on server , will require puppeteer
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const puppeteer = require('puppeteer');

const JUKED_URL = 'https://juked.gg/wc3';
const JUKED_XPATH = '/html/body/div[1]/div/div[3]/div[1]/div/div[2]/div[2]/div[1]/div[1]/img';

const RARLAB_URL = 'https://www.rarlab.com/themes.htm';
const RARLAB_XPATH = '/html/body/table/tbody/tr/td[2]/p[2]/img';

async function scrapeData(url) {
  // const browser = await puppeteer.launch({headless: false, devtools: true});
  console.log('Launching Puppeteer browser...');
  const options = {
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-zygote',
      '--disable-gpu'
    ]
  };
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  // await page.setRequestInterception(true);
  // page.on('request', async request => {
  //   if (request.resourceType() === 'image') {
  //     await request.abort();
  //   } else {
  //     await request.continue();
  //   }
  // });
  console.log('Visiting JUKED_URL...');
  await page.goto(JUKED_URL, {waitUntil: 'load'});
  // console.log('Waiting for XPath To Resolve...');
  // await page.waitForXPath(JUKED_XPATH);
  const [el] = await page.$x(JUKED_XPATH);
  console.log('XPath Resolved...');
  return { hi: 'hihihi'};

  // const src = await el.getProperty('src');
  // const srcTxt = await src.jsonValue();

  // console.log('srcText here : ', srcTxt);
  // browser.close();
  // return {srcTxt};
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
  console.log('DATA HAS BEEN SCRAPED');
  res.status(200).send(output);
});

let PORT = 3000;

app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
})
