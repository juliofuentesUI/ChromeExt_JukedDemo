console.log('BACKGROUND.JS EXECUTED');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.fetchWarcraftDates) {
        fetch('https://juked.gg/wc3')
        .then(response => {
            console.log(response);
            return response.text();
        })
        .then(html => {
            console.log('Sending response back as html...');
            sendResponse(html);
        })
        return true;
    }

    //return true MEANS, at least the way chrome works.
    //that this will EVENTUALLY Send the repsonse back asynchronously.
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