const config = require('../config');

async function getSpotifyAccessToken() {
  const spotifyAuthUrl = "https://accounts.spotify.com/api/token";
  const clientId = config.spotifyClientId;
  const clientSecret = config.spotifyClientSecret;
  const formBody = new URLSearchParams({
    grant_type: 'client_credentials',
  }).toString();

  const authResponse = await fetch(spotifyAuthUrl, {
    method: 'POST',
    body: formBody,
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const authData = await authResponse.json();
  return authData["access_token"];
}

async function searchSpotifyTrack(videoName, accessToken) {
  const spotifySearchUrl = `https://api.spotify.com/v1/search?q=${videoName}&type=track`;
  const searchResponse = await fetch(spotifySearchUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  const searchData = await searchResponse.json();
  return searchData["tracks"]["items"];
}

module.exports = {
  getSpotifyAccessToken,
  searchSpotifyTrack,
};
