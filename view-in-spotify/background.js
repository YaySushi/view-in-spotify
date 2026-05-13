chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) sendRequest();
});

function isYouTubeWatchUrl(url) {
    return url.includes("youtube.com/watch") || url.includes("youtu.be/");
}

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

function notifySearchError(serverError) {
    chrome.storage.sync.set({ name: "", artist: "", uri: "", image_link: "" });
    chrome.runtime.sendMessage(
        { greeting: "searchError", error: serverError || null },
        function () { }
    );
}

function sendRequest() {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        const tab = tabs[0];
        if (!tab || !tab.url) {
            notifySearchError(null);
            return;
        }

        if (!isYouTubeWatchUrl(tab.url)) {
            return;
        }

        const videoId = encodeURIComponent(getVideoId(tab.url));
        const url = `http://localhost:3001/getSong?video_id=${videoId}`;

        let res;
        let data;
        try {
            res = await fetch(url);
            data = await res.json();
        } catch {
            notifySearchError(null);
            return;
        }

        if (res.ok && data && data.body) {
            display(data.body);
            return;
        }

        notifySearchError(data && data.error ? data.error : null);
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.greeting === "sendSearchRequest") sendRequest();
    }
);
