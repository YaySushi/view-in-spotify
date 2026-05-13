searchBtn.addEventListener("click", async () => {
    chrome.runtime.sendMessage(
        {greeting: "sendSearchRequest"},
        function(response) {}
    );
});

const DEFAULT_ERROR_MESSAGE = "Could not look up this song right now. Try again in a moment.";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting === "addToHtml") {
        chrome.storage.sync.get(['name', 'artist', 'uri', 'image_link'], function (data) {
            var clickable_anchor = document.getElementById("clickable");
            var image = document.getElementById("song_img");
            var artist_name_html = document.getElementById("artist_name");
            var song_name_html = document.getElementById("song_name");
            var description_html = document.getElementById("description");

            clickable_anchor.setAttribute('href', data.uri);
            artist_name_html.innerHTML = data.artist;
            song_name_html.innerHTML = data.name;
            description_html.innerHTML = 'The following song was found on Spotify:';
            image.src = data.image_link;
        });
    } else if (request.greeting === "searchError") {
        var description_html = document.getElementById("description");
        var clickable_anchor = document.getElementById("clickable");
        var image = document.getElementById("song_img");
        var artist_name_html = document.getElementById("artist_name");
        var song_name_html = document.getElementById("song_name");

        description_html.textContent = request.error?.message || defaultErrorMessage();
        clickable_anchor.setAttribute("href", "#");
        song_name_html.textContent = "";
        artist_name_html.textContent = "";
        image.src = "";
    }
});