let associatedDomains = {
    "https://www.hltv.org/": 'lol',
    "https://www.dotabuff.com/": 'dota2'
};

const LOCAL_SERVER_URL = 'http://localhost:3000';

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
        })
        .catch(error => {
            console.log('error received', error);
        });
        console.log('This domain exist in our associated domains object');
    }

}, { url: [{ hostContains: 'hltv'}, {hostContains: 'dotabuff'}]});


chrome.runtime.onSuspend.addListener(() => {
    console.log('On Suspend event fired');
});


chrome.runtime.onSuspendCanceled.addListener(() => {
    console.log('onSuspendCanceled fired');
});






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