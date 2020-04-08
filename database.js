const MongoClient = require('mongodb').MongoClient;
const URI = "mongodb+srv://jukedDemoUser:jukedDemoPassword@juked-webscrape-data-db-mku6u.mongodb.net/test?retryWrites=true&w=majority"
const DB_NAME = "JUKED-WEBSCRAPE-DATA-DB";
const { scrapeData } = require('./serverScraper.js');

const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
let db;
let collection;
client.connect(error => {
    console.log('Connected successfully');
    db = client.db(DB_NAME);
    collection = db.collection('CSGO_CALENDAR');
    //clear database for demo purposes.
    collection.deleteMany({}, (error, result) => {
        if (error) console.log('oops', error);
        if (result) console.log('Successfully deleted');
    });
    // collection.insertMany([event1, event2], (error, result) => {
        // if (error) console.log('oops', error);
        // if (result) console.log('result', result);
    // });
    // do shit here
});


async function fetchUpcomingEvents(url) {
    //use webscraper here.
    let result = await scrapeData(url);
    console.log('fetching upcoming events');
    return result;
};


module.exports = { fetchUpcomingEvents }


// let event1 = {
//         "nameOfDay": "Live Now",
//         "timeTilStart": "Started",
//         "liveViewerCount": "3,453",
//         "nameOfGame": "CSGO",
//         "eventNameAndPrize": "ESL Masters Season 7\nSwiss\n-\n€10,000",
//         "eventLogo": "https://img.abiosgaming.com/games/cs-square-logo.png",
//         "team1Name": "GIA",
//         "team2Name": "S2V",
//         "team1Logo": "https://img.abiosgaming.com/casters/s2v-logo.png",
//         "urlToStream": "https://juked.gg/e/4581"
// };

// let event2 = {
//         "nameOfDay": "Live Now",
//         "timeTilStart": "Started",
//         "liveViewerCount": "123,408",
//         "nameOfGame": "CSGO",
//         "eventNameAndPrize": "ESL Pro League 11 Europe\nGroups\n-\n$531,000",
//         "eventLogo": "https://img.abiosgaming.com/events/ESL-Pro-League-2019-Square.jpeg",
//         "team1Name": "FAZE",
//         "team2Name": "NAV",
//         "team1Logo": "https://img.abiosgaming.com/competitors/Natus-Vincere-Navi-new-logo.png",
//         "urlToStream": "https://juked.gg/e/4430"
// };