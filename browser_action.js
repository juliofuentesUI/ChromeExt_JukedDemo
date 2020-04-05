const fetchDates = () => {
    chrome.runtime.sendMessage({
        fetchWarcraftDates: true 
    }, (response) => {
        console.log('[BrowserAction.js] HAS RECEIVED DATA BACK!');
        console.log(response);
    });
}

let fetchButton = document.getElementById('loadWc3');
fetchButton.addEventListener('click', (event) => {
    fetchDates();
});
