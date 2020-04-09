const MongoClient = require('mongodb').MongoClient;
const URI = "mongodb+srv://jukedDemoUser:jukedDemoPassword@juked-webscrape-data-db-mku6u.mongodb.net/test?retryWrites=true&w=majority"
const DB_NAME = "JUKED-WEBSCRAPE-DATA-DB";
const { scrapeData } = require('./serverScraper.js');


let db;
initializeConnection();

function initializeConnection() {
    const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(error => {
        console.log('Connected to MongoAtlasDB');
        db = client.db(DB_NAME);
        clearAllCollections(db).then(() => {
            fetchUpcomingEvents('csgo');
            fetchUpcomingEvents('lol');
        })
    });
}

function updateCollection(gameEventList, game) {
    let collection = db.collection(game);
    let bulkUpdateOps = [];
    for(let day of gameEventList.allEvents) {
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
    collection.bulkWrite(bulkUpdateOps).then((result) => {
        console.log(`inserted ${result.insertedCount}`);
        console.log(`deleted ${result.deletedCount}`);
        console.log(`modified ${result.modifiedCount}`);
    });
}

async function fetchUpcomingEvents(game) {
    //use webscraper here.
    let gameEventList = await scrapeData(game);
    console.log(gameEventList);
    updateCollection(gameEventList, game);
    return gameEventList;
};

function queryDatabase(game) {
    return new Promise((resolve, reject) => {
        console.log('Querying database...')
        let collection = db.collection(game);
        collection.find().toArray().then((docs, error) => {
            if (error) reject(error);
            if (docs) resolve(docs); 
        });
    })
};

function clearAllCollections(db) {
    console.log('Clearing all collections...');
    return new Promise((resolve, reject) => {
        db.collections((error, collections) => {
            collections.forEach(collection => {
                collection.deleteMany({}, (err, result) => {
                    if (error) reject('Error occured');
                    if (result) resolve('Cleared collection');
                });
            });
        });
    });

};


module.exports = { fetchUpcomingEvents , queryDatabase }




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

