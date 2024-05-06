chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) sendRequest();
});

function getVideoId(url) {
    //gets the video id from a youtube link.
    try {
        return url.split("?v=")[1].split("&")[0];
    } catch (err) {
        return "";
    }
}

function display(track) {
    chrome.storage.sync.set({
        name: track['name'],
        artist: track['artists'][0]['name'],
        uri: track['uri'],
        image_link: track['album']['images'][0]['url']
    });
    chrome.runtime.sendMessage({ greeting: "addToHtml" }, function (response) { });
}

function sendRequest() {
    chrome.tabs.query({ active: true}, tabs => {
        // use current tab to get its link for video_id
        const video_id = getVideoId(tabs[0].url);
        // backend is not hosted anywhere so...
        fetch(`http://localhost:3001/getSong?video_id=${video_id}`)
            .then(res => res.json()).then(data => {
                display(data.body);
            })
            .catch(error => console.error('Error:', error));

    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting === "sendSearchRequest") sendRequest();
    }
);