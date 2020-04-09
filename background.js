let associatedDomains = {
    "https://www.hltv.org/": 'lol',
    "https://www.dotabuff.com/": 'dota2'
};

const LOCAL_SERVER_URL = 'http://localhost:3000';
let currentNotificationId = null;
let currentNotificationLink = 'https://juked.gg';

chrome.webNavigation.onCompleted.addListener((tab) => {
    //check to make sure its MAIN FRAME not subframe. mainframe is 0, rest are positive.
    console.log('webNavigation onCompleted event fired');
    let gameName = associatedDomains[tab.url];
    if (tab.frameId === 0 && gameName) {
        //from here...do we ... hit the server endpoint?? check local storage??? 
        // we should check local storage FIRST ... or check for 'live nows!' 
        // make a query for live now! ONLY live now! the rest can go into calendar.
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


chrome.runtime.onSuspend.addListener(() => {
    console.log('On Suspend event fired');
});


chrome.runtime.onSuspendCanceled.addListener(() => {
    console.log('onSuspendCanceled fired');
});

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    console.log('A notification button was clicked');
    console.log('buttonIndex is', buttonIndex);
    console.log('notificationId : ', notificationId);
    console.log('currentNotificationId : ', currentNotificationId);
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

function getBlobUrl(url) {    
    return fetch(url).then(response => {
            return response.blob();
        }).then(blob => {
            return window.URL.createObjectURL(blob);
        });
};


// chrome.runtime.onInstalled.addListener(function () {
//     chrome.storage.sync.set({color: '#3aa757'}, function() {
//         console.log('The color is green');
//     });
//     chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//         console.log('PAGE HAS BEEN CHANGED');
//         chrome.declarativeContent.onPageChanged.addRules([{
//             conditions: [new chrome.declarativeContent.PageStateMatcher({
//                 pageUrl: {hostEquals: 'developer.chrome.com'}
//             })],
//             actions: [new chrome.declarativeContent.ShowPageAction()]
//         }])
//     })
// });