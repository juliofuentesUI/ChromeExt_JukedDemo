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
    testUpdate();

    // clearAllCollections(db);
    //clear database for demo purposes.
    // collection.deleteMany({}, (error, result) => {
        // if (error) console.log('oops', error);
        // if (result) console.log('Successfully deleted');
    // });
    // collection.insertMany([event1, event2], (error, result) => {
        // if (error) console.log('oops', error);
        // if (result) console.log('result', result);
    // });
    // do shit here
});

async function fetchUpcomingEvents(game) {
    //use webscraper here.
    let gameEventList = await scrapeData(game);
    // updateCollection(gameEventList, game);
    return gameEventList;
};

function updateCollection(gameEventList, game) {
    //shape of data is like this gameEventlist.allEvents is an array []
    //each Day like today tmmrw live now is a sub array of allEvents [[<Monday>], [<Tuesday>], [<Wednesday>]]
    //inside Each sub array, are objects each represetngin an event of that day.
    let collection = db.collection(game);
    let bulkUpdateOps = [];
    for(let day of gameEventList) {
        day.forEach((event) => {
            bulkUpdateOps.push({
                updateOne: {
                    "filter": { "eventNameAndPrize": event.eventNameAndPrize },
                    "update": { $set: event },
                    "upsert": true
                }
            })
        });
    }
    let result = collection.bulkWrite(bulkUpdateOps);
    console.log('bulkUpdateOperation complete, the result is', result);
}

function clearAllCollections(db) {
    db.collections((error, collections) => {
        collections.forEach(collection => {
            collection.deleteMany({}, (err, result) => {
                if (error) console.log('oops', error);
                if (result) console.log('Deleted all documents');
            });
        });
    });
};

function testUpdate() {
    const CSGO_COLLECTION = db.collection('csgo');
    console.log('We have handle on csgo collection, now aboutt o send update');
    CSGO_COLLECTION.updateOne({eventNameAndPrize: 'julios fucking event' }, { $set: event1 }, {upsert: true});
}


module.exports = { fetchUpcomingEvents }




// let event1 = {
//         "nameOfDay": "Live Now",
//         "timeTilStart": "IS OVER",
//         "liveViewerCount": "0",
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

