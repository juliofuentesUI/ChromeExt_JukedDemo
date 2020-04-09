const associatedDomains = {
    "https://www.hltv.org/": 'lol',
    "https://www.dotabuff.com/": 'dota2'
};

const LOCAL_SERVER_URL = 'http://localhost:3000';

let currentNotificationId = null;
let currentNotificationLink = 'https://juked.gg';

chrome.webNavigation.onCompleted.addListener((tab) => {
    console.log('webNavigation onCompleted event fired');
    let gameName = associatedDomains[tab.url];
    if (tab.frameId === 0 && gameName) {

        fetch(`${LOCAL_SERVER_URL}/${gameName}`)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('DATA RECEIVED!', data);
            storeAndNotify(gameName, data);
        })
        .catch(error => {
            console.log('error received', error);
        });
    }

}, { url: [{ hostContains: 'hltv'}, {hostContains: 'dotabuff'}]});


chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (notificationId === currentNotificationId) {
        if (buttonIndex === 0) {
            chrome.tabs.create({ 
                url: currentNotificationLink
            }, (Tab) => {console.log('User has been sent to stream');})
        }
    }
});

function storeAndNotify(gameName, eventData) {
    chrome.storage.local.set({ [gameName] : eventData}, (success) => {
        if (success) console.log(`${gameName} data stored!`)
        if (chrome.runtime.lastError) console.log(`Error during set : ${chrome.runtime.lastError.message}`);
    });
    //now create a notification.
    for (let stream of eventData) {
        if (stream.nameOfDay === 'Live Now') {
            currentNotificationLink = stream.urlToStream;
            chrome.notifications.create('', {
                type: 'image',
                imageUrl: './images/jukedgg_icon.png',
                iconUrl: './images/jukedgg_icon.png',
                title: `Live Stream for ${gameName}`,
                message: 'Click to watch on JukedGG!',
                buttons: [
                    { title: 'Go to Stream'},
                    { title: 'Ignore'}
                ]
            }, (id) => { currentNotificationId = id});
            break;
        }
    }
};