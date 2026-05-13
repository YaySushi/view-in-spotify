const config = require('../config');

async function getYoutubeTitle(videoId) {
  if (typeof videoId !== 'string' || !videoId.trim()) {
    throw new Error('Missing YouTube video id.');
  }

  const trimmed = videoId.trim();
  const params = new URLSearchParams({
    id: trimmed,
    key: config.youtubeApiKey,
    fields: 'items(snippet(title))',
    part: 'snippet',
  });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data.error?.message || response.statusText || 'YouTube API request failed.';
    const status = response.status >= 400 && response.status < 500 ? response.status : 502;
    throw new Error(detail);
  }

  const items = data.items;
  if (!items || items.length === 0) {
    throw new Error('Could not load this YouTube video title.');
  }

  const title = items[0]?.snippet?.title;
  if (typeof title !== 'string' || !title) {
    throw new Error('Unexpected YouTube API response.');
  }
  return title;
}

module.exports = {
  getYoutubeTitle,
};
