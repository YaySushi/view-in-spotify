const config = require('../config');

async function getYoutubeTitle(videoId) {
  const youtubeApiKey = config.youtubeApiKey;
  const youtubeSearchUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${youtubeApiKey}&fields=items(snippet(title))&part=snippet`;

  const response = await fetch(youtubeSearchUrl);
  const data = await response.json();

  if (data["items"].length > 0) {
    return data["items"][0]["snippet"]["title"];
  }
  return "";
}

module.exports = {
  getYoutubeTitle,
};
