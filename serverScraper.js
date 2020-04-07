//this runs on server , will require puppeteer
const puppeteer = require('puppeteer');

const JUKED_URL = 'https://juked.gg/csgo';
const CSGO_CALENDAR_NODE = '#calendar';

const RARLAB_URL = 'https://www.rarlab.com/themes.htm';
const RARLAB_XPATH = '/html/body/table/tbody/tr/td[2]/p[2]/img';

const traverseCalendar = (calendar) => {
  //native calendar. Now traverse it with jQUERY or native javascript. your call. 
  let eventDays = calendar.firstChild.children[1].children;
  let scrapedData = [];
  for (let day of eventDays) {
    scrapedData.push(extractEventInfo(day));
    // console.log(day.children[1].firstChild.children);

    // console.log(day.children[1].firstChild.children);
  }
  // console.log('eventDays is : ', eventDays);
  // remember at some point to check for list length to be 7 or 8. this will dictate a lot. 
  return null
};

const extractEventInfo = (day) => {
  let events = day.children[1].firstChild.children;
  for(let event of events) {
    if (event.children.length === 7) {
      //do stuff
      let eventData = {};
      eventData.timeTilStart = event.children[0].innerText; //extracts "2:00 am"
      eventData.nameOfGame = event.children[1].innerText; //extracts "CSGO"
      eventData.eventNameAndPrize = event.children[2].innerText; //extracts "NEX Play From Home Group B - Winners' match -$20,000"
      eventData.eventLogo = event.children[2].querySelector('img').src; // extracts "https://img.abiosgaming.com/games/cs-square-logo.png"
      eventData.team1Name = event.children[3].querySelector('.left').innerText; //extracts first teams name 'ZIGMA'
      eventData.team2Name = event.children[3].querySelector('.right').innerText; //extracts second teams name 'TIGER'
      eventData.team1Logo = event.children[3].querySelector('img').src; //extracts first teams logo url https://juked.gg/images/playerPlaceHolder.png
      eventData.team1Logo = event.children[3].querySelectorAll('img')[1].src; //extracts second teams logo url https://juked.gg/images/playerPlaceHolder.png
    } else if (event.children.length === 8) {
      //the event has a timer
    }
  }
}


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
  try {
    const browser = await puppeteer.launch({
      headless: false, 
      devtools: true, 
      defaultViewport: {
        width: 1060,
        height: 1006
      }});
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
    console.log('Finished Loading Completely');
    // console.log('Waiting for XPath To Resolve...');
    // await page.waitForXPath(JUKED_XPATH);
    // const [el] = await page.$x(JUKED_XPATH);
    console.log('WAITFORSELECTOR CALENDAR NODE');
    let calendarHandle = await page.waitForSelector(CSGO_CALENDAR_NODE);
    console.log('CALENDAR NODE FOUND');
    //we have the handle. Use .evaluate(callback) and start traversing it for data. Create a helper method
    // console.log('BEGIN TIMEOUT 5 SECONDS');
    await page.waitFor(5000);
    console.log('BEGIN TRAVERSAL');
    let allEvents = await calendarHandle.evaluate(traverseCalendar);
  
    // browser.close();
  
  
    // const srcTxt = await src.jsonValue();
  
    // console.log('srcText here : ', srcTxt);
    // browser.close();
    // return {srcTxt};
  } catch (error) {
    console.error(error);
  }
};







module.exports = { scrapeData };