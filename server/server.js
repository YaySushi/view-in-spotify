require('dotenv').config();
const express = require('express');
const { cleanVideoName } = require('./helpers');
const { searchSpotifyTrack, getSpotifyAccessToken } = require('./spotify');
const { getYoutubeTitle } = require('./youtube');

const app = express();
const port = process.env.PORT || 3001;
app.use(express.json());


app.get('/getSong', async (req, res) => {
  try {
    const videoId = req.query.video_id;
    const videoName = cleanVideoName(await getYoutubeTitle(videoId));
    console.log(videoName);

    const accessToken = await getSpotifyAccessToken();
    const tracks = await searchSpotifyTrack(videoName, accessToken);
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