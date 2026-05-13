const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
    chrome.runtime.sendMessage({ greeting: "sendSearchRequest" });
});

const DEFAULT_ERROR_MESSAGE = "Could not look up this song right now. Try again in a moment.";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting === "addToHtml") {
        chrome.storage.sync
            .get(["name", "artist", "uri", "image_link"])
            .then((data) => {
                document.getElementById("clickable").setAttribute("href", data.uri);
                document.getElementById("song_img").src = data.image_link;
                document.getElementById("song_name").textContent = data.name;
                document.getElementById("artist_name").textContent = data.artist;
                document.getElementById("description").textContent =
                    "The following song was found on Spotify:";
            });
    } else if (request.greeting === "searchError") {
        document.getElementById("description").textContent =
            request.error?.message || DEFAULT_ERROR_MESSAGE;
        document.getElementById("clickable").setAttribute("href", "#");
        document.getElementById("song_name").textContent = "";
        document.getElementById("artist_name").textContent = "";
        document.getElementById("song_img").src = "";
    }
});