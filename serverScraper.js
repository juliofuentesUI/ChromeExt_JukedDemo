//this runs on server , will require puppeteer
const puppeteer = require('puppeteer');

const BASE_URL = "https://juked.gg"
const CALENDAR_NODE = '#calendar';


const scrapeData = async (game) => {
  console.log('Launching Puppeteer browser...');
  const GAME_URL = `${BASE_URL}/${game}`;
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
      defaultViewport: {
        width: 1060,
        height: 1006
      }});
    const page = await browser.newPage();
    await page.goto(GAME_URL, {waitUntil: 'load'});
    const calendarHandle = await page.waitForSelector(CALENDAR_NODE);
    await page.waitFor(5000);
    console.log('Beginning Traversal');
    const allEvents = await calendarHandle.evaluate(traverseCalendar);
    console.log('Data scrape complete');
  
    browser.close();
    
    return {allEvents};
  
  } catch (error) {
    console.error(error);
  }
};

const traverseCalendar = (calendar) => {
  //DONT FORGET. THIS IS EXECUTING IN PAGE CONTEXT, NOT NODE CONTEXT because EVAL 
  console.log('Function TraverseCalendar executing...');
  const eventDays = calendar.firstChild.children[1].children;
  const scrapedData = [];
  for (let day of eventDays) {
    scrapedData.push(extractEventInfo(day));
  }
  console.log('scrapedData is', scrapedData);
  return scrapedData;

  function extractEventInfo(day) {
    const events = day.children[1].firstChild.children;
    const nameOfDay = day.id;
    const allEvents = [];
    for(let event of events) {
      const eventData = {};
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