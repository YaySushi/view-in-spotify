const API_BASE = "http://localhost:3001";

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

async function display(track) {
    await chrome.storage.sync.set({
        name: track.name,
        artist: track.artists[0].name,
        uri: track.uri,
        image_link: track.album.images[0].url,
    });
    await chrome.runtime.sendMessage({ greeting: "addToHtml" });
}

async function notifySearchError(serverError) {
    await chrome.storage.sync.set({ name: "", artist: "", uri: "", image_link: "" });
    await chrome.runtime.sendMessage({
        greeting: "searchError",
        error: serverError || null,
    });
}

async function sendRequest() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs[0];
    if (!tab?.url) {
        return;
    }

    if (!isYouTubeWatchUrl(tab.url)) {
        return;
    }

    const videoId = encodeURIComponent(getVideoId(tab.url));
    const url = `${API_BASE}/getSong?video_id=${videoId}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok && data?.body) {
            await display(data.body);
            return;
        }
        await notifySearchError(data?.error ?? null);
    } catch {
        await notifySearchError(null);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting === "sendSearchRequest") {
        sendRequest();
    }
});
