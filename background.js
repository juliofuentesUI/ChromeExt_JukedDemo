// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.fetchWarcraftDates) {
//         fetch('https://juked.gg/wc3')
//         .then(response => {
//             console.log(response);
//             return response.text();
//         })
//         .then(html => {
//             console.log('Sending response back as html...');
//             sendResponse(html);
//         })
//         return true; 
//     //return true MEANS, at least the way chrome works.
//     //that this will EVENTUALLY Send the repsonse back asynchronously.
//     }
// });

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     console.log('changeInfo object', changeInfo);
//     console.log('tab  object: ', tab);
// });
let associatedDomains = {
    "https://www.hltv.org/": 'lol',
    "https://www.dotabuff.com/": 'dota2'
};

chrome.webNavigation.onCompleted.addListener((tab) => {
    //check to make sure its MAIN FRAME not subframe. mainframe is 0, rest are positive.
    console.log('webNavigation onCompleted event fired');
    if (tab.frameId === 0 && associatedDomains[tab.url]) {
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