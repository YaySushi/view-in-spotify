const config = require('../config');

async function getSpotifyAccessToken() {
  const spotifyAuthUrl = 'https://accounts.spotify.com/api/token';
  const formBody = new URLSearchParams({
    grant_type: 'client_credentials',
  }).toString();

  const authResponse = await fetch(spotifyAuthUrl, {
    method: 'POST',
    body: formBody,
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.spotifyClientId}:${config.spotifyClientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const authData = await authResponse.json().catch(() => ({}));

  if (!authResponse.ok) {
    const detail = authData.error_description || authData.error || authResponse.statusText;
    throw new Error(detail || 'Spotify authentication failed.');
  }
  if (!authData.access_token) {
    throw new Error('Spotify authentication failed.');
  }
  return authData.access_token;
}

async function getSpotifyTrack(videoName) {
  const accessToken = await getSpotifyAccessToken();
  const params = new URLSearchParams({ q: videoName, type: 'track' });
  const searchResponse = await fetch(`https://api.spotify.com/v1/search?${params}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const searchData = await searchResponse.json().catch(() => ({}));

  if (!searchResponse.ok) {
    const detail = searchData.error?.message || searchResponse.statusText || 'Spotify search failed.';
    throw new Error(detail);
  }

  const tracks = searchData.tracks?.items;
  if (!Array.isArray(tracks)) {
    throw new Error('Unexpected Spotify response.');
  }
  return tracks;
}

module.exports = {
  getSpotifyTrack,
};
