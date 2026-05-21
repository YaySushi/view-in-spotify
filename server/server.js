const config = require('./config');
const express = require('express');
const { cleanVideoName, sendError } = require('./helpers');
const { getSpotifyTrack } = require('./services/spotify');
const { getYoutubeTitle } = require('./services/youtube');

const app = express();
const port = config.port;
app.use(express.json());

const DEFAULT_ERROR_MESSAGE = "Could not look up this song right now. Try again in a moment.";

app.get('/getSong', async (req, res) => {
  try {
    const videoId = req.query.video_id;
    const rawTitle = await getYoutubeTitle(videoId);
    const videoName = cleanVideoName(rawTitle);

    const tracks = await getSpotifyTrack(videoName);
    if (tracks.length === 0) {
      return sendError(res, 404, 'No matching track found on Spotify.');
    }

    // yay, we found a track!
    return res.status(200).json({ body: tracks[0] });
  } catch (error) {
    // it doesn't matter to the end user what error occurred (EXCEPT when no
    // matching track was found). so, we can just return 500 with a default message.
    console.log(JSON.stringify({
      severity: 'ERROR',
      message: `(/getSong) error: ${error.stack || error.message}`,
    }));
    return sendError(res, 500, DEFAULT_ERROR_MESSAGE);
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

module.exports = app;