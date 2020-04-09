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
                    "filter": { "eventNameAndPrize": event.eventNameAndPrize, "nameOfDay": event.nameOfDay },
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
    updateCollection(gameEventList, game);

    return gameEventList;
};

async function queryDatabase(gameName) {
    return new Promise((resolve, reject) => {
        console.log(`Querying database for ${gameName}...`);
        checkCollectionExist(gameName)
        .then(exists => {
            let collection = db.collection(gameName);
            console.log(collection);
            collection.find().toArray().then((docs, error) => {
                if (error) reject(error);
                if (docs) resolve(docs); 
            });
        })
        .catch(async doesNotExist => {
           let gameEventList = await fetchUpcomingEvents(gameName);
           let collection = db.collection(gameName);
           console.log(collection);
           collection.find().toArray().then((docs, error) => {
               if (error) reject(error);
               if (docs) resolve(docs);
           })
        });
    })
};


function checkCollectionExist(gameName) {
    console.log('Checking if exists...');
    return new Promise((resolve, reject) => {
        db.listCollections({name: gameName })
            .next((error, collInfo) => {
                console.log(error, collInfo);
                if (collInfo) {
                    resolve(true);
                } else {
                    reject(false)
                }
            })
    });
}

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