searchBtn.addEventListener("click", async () => {
    chrome.runtime.sendMessage(
        {greeting: "sendSearchRequest"},
        function(response) {}
    );
});


chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) { 
    if(request.greeting === "addToHtml") {
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
            image.src = data.image_link 
        });
        
    }
});