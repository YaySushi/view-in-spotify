require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());


app.get('/getSong', async (req, res) => {
  try {
    const youtubeApiKey = process.env.YOUTUBE_API_KEY;
    const videoId = req.query.video_id;
    const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&fields=items(snippet(title))&part=snippet`;

    const response = await fetch(youtubeSearchUrl);
    const data = await response.json();

    let videoName = "";
    if (data["items"].length > 0) {
      videoName = data["items"][0]["snippet"]["title"];
      videoName = cleanVideoName(videoName);
    }
    console.log(videoName);

    // authenticate:
    const spotifyAuthUrl = "https://accounts.spotify.com/api/token";
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const form = {
      'grant_type': 'client_credentials'
    };

    let formBody = [];
    for (let property in form) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(form[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    formBody = formBody.join("&");

    const options = {
      method: 'POST',
      body: formBody,
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    };

    const authResponse = await fetch(spotifyAuthUrl, options);
    const authData = await authResponse.json();
    const accessToken = authData["access_token"];

    // get song:
    const spotifySearchUrl = `https://api.spotify.com/v1/search?q=${videoName}&type=track`;
    const searchOptions = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    };

    const searchResponse = await fetch(spotifySearchUrl, searchOptions);
    const searchData = await searchResponse.json();

    const tracks = searchData["tracks"]["items"];
    if (tracks && tracks.length > 0) {
      return res.send({
        body: tracks[0]
      });
    }
    return res.status(404).send('Not Found');
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

function cleanVideoName(videoName) {
  //remove anything in brackets (i.e. "(Official Video)") since it messes
  //up with Spotify's search. also remove dashes.
  videoName = videoName.replace('-', "");
  videoName = videoName.replace('"', "");
  videoName = videoName.replace(/\([\s\S]*\)/g, "");
  videoName = videoName.replace(/\[[\s\S]*\]/g, "");
  return videoName;
}