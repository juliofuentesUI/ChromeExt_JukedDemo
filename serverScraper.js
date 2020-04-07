//this runs on server , will require puppeteer
const puppeteer = require('puppeteer');

const JUKED_URL = 'https://juked.gg/csgo';
const CALENDAR_NODE = '#calendar';

async function scrapeData(url) {
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
    await page.goto(url || JUKED_URL, {waitUntil: 'load'});
    let calendarHandle = await page.waitForSelector(CALENDAR_NODE);
    await page.waitFor(5000);
    console.log('Beginning Traversal');
    let allEvents = await calendarHandle.evaluate(traverseCalendar);
    console.log('Data scrape complete');
  
    browser.close();
    
    return {allEvents};
  
  } catch (error) {
    console.error(error);
  }
};

const traverseCalendar = (calendar) => {
  //DONT FORGET. THIS IS EXECUTIGN NOT IN NODE CONTEXT, BUT PAGE CONTEXT INSIDE BROWSER.
  console.log('Function TraverseCalendar executing...');
  let eventDays = calendar.firstChild.children[1].children;
  let scrapedData = [];
  for (let day of eventDays) {
    scrapedData.push(extractEventInfo(day));
  }
  console.log('scrapedData is', scrapedData);
  return scrapedData;

  function extractEventInfo(day) {
    let events = day.children[1].firstChild.children;
    let nameOfDay = day.id;
    let allEvents = [];
    for(let event of events) {
      let eventData = {};
      eventData.nameOfDay = nameOfDay; //extracts "Live Now" or "Tomorrow"

      switch(event.children.length) {
        case 7:
          eventData.timeTilStart = event.children[0].innerText; //extracts "2:00 am"
          eventData.nameOfGame = event.children[1].innerText; //extracts "CSGO"
          eventData.eventNameAndPrize = event.children[2].innerText; //extracts "NEX Play From Home Group B - Winners' match -$20,000"
          eventData.eventLogo = event.children[2].querySelector('img').src; // extracts "https://img.abiosgaming.com/games/cs-square-logo.png"
          eventData.team1Name = event.children[3].querySelector('.left').innerText; //extracts first teams name 'ZIGMA'
          eventData.team2Name = event.children[3].querySelector('.right').innerText; //extracts second teams name 'TIGER'
          eventData.team1Logo = event.children[3].querySelector('img').src; //extracts first teams logo url https://juked.gg/images/playerPlaceHolder.png
          eventData.team1Logo = event.children[3].querySelectorAll('img')[1].src; //extracts second teams logo url https://juked.gg/images/playerPlaceHolder.png
          eventData.urlToStream = event.children[event.children.length - 1].href; //extracts URL to stream 
          allEvents.push(eventData);
          break;
        case 6:
          //ONLY "LIVE NOW" events have this much markup
          eventData.timeTilStart = 'Started'; // this one will be live, so it has viewer count instead.
          eventData.liveViewerCount = event.children[0].innerText;
          eventData.nameOfGame = event.children[1].innerText; //extracts "CSGO"
          eventData.eventNameAndPrize = event.children[2].innerText; //extracts "NEX Play From Home Group B - Winners' match -$20,000"
          eventData.eventLogo = event.children[2].querySelector('img').src; // extracts "https://img.abiosgaming.com/games/cs-square-logo.png"
          eventData.team1Name = event.children[4].querySelector('.left').innerText; //extracts first teams name 'ZIGMA'
          eventData.team2Name = event.children[4].querySelector('.right').innerText; //extracts second teams name 'TIGER'
          eventData.team1Logo = event.children[4].querySelector('img').src; //extracts first teams logo url https://juked.gg/images/playerPlaceHolder.png
          eventData.team1Logo = event.children[4].querySelectorAll('img')[1].src; //extracts second teams logo url https://juked.gg/images/playerPlaceHolder.png
          eventData.urlToStream = event.children[event.children.length - 1].href; //extracts URL to stream 
          allEvents.push(eventData);

          break;
        case 8:
          eventData.timeTilStart = `Starts in ${event.children[1].innerText}`; //extracts "41m"
          eventData.nameOfGame = event.children[2].innerText; //extracts "CSGO"
          eventData.eventNameAndPrize = event.children[3].innerText; //extracts "NEX Play From Home Group B - Winners' match -$20,000"
          eventData.eventLogo = event.children[3].querySelector('img').src; // extracts "https://img.abiosgaming.com/games/cs-square-logo.png"
          eventData.team1Name = event.children[4].querySelector('.left').innerText; //extracts first teams name 'ZIGMA'
          eventData.team2Name = event.children[4].querySelector('.right').innerText; //extracts second teams name 'TIGER'
          eventData.team1Logo = event.children[4].querySelector('img').src; //extracts first teams logo url https://juked.gg/images/playerPlaceHolder.png
          eventData.team1Logo = event.children[4].querySelectorAll('img')[1].src; //extracts second teams logo url https://juked.gg/images/playerPlaceHolder.png
          eventData.urlToStream = event.children[event.children.length - 1].href; //extracts URL to stream 
          allEvents.push(eventData);
          break;
      }
    } 
    return allEvents;
  }
};



module.exports = { scrapeData };