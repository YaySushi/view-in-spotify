require('dotenv').config();

const youtubeApiKey = (process.env.YOUTUBE_API_KEY || '').trim();
const spotifyClientId = (process.env.SPOTIFY_CLIENT_ID || '').trim();
const spotifyClientSecret = (process.env.SPOTIFY_CLIENT_SECRET || '').trim();

const missing = [];
if (!youtubeApiKey) missing.push('YOUTUBE_API_KEY');
if (!spotifyClientId) missing.push('SPOTIFY_CLIENT_ID');
if (!spotifyClientSecret) missing.push('SPOTIFY_CLIENT_SECRET');
if (missing.length > 0) {
  console.error(
    `Missing or empty required environment variable(s): ${missing.join(', ')}. Set them in .env or the process environment.`
  );
  process.exit(1);
}

module.exports = {
  youtubeApiKey,
  spotifyClientId,
  spotifyClientSecret,
  port: parseInt(process.env.PORT, 10) || 3001,
};
