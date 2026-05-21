jest.mock('../../services/youtube', () => ({
  getYoutubeTitle: jest.fn(),
}));

jest.mock('../../services/spotify', () => ({
  getSpotifyTrack: jest.fn(),
}));

const request = require('supertest');
const app = require('../../server');
const { getYoutubeTitle } = require('../../services/youtube');
const { getSpotifyTrack } = require('../../services/spotify');

describe('GET /getSong', () => {
  const sampleTrack = {
    id: 'spotify-track-1',
    name: 'Cleaned Song',
    artists: [{ name: 'Artist' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the first Spotify match for a YouTube video', async () => {
    getYoutubeTitle.mockResolvedValue('Artist - Song (Official Video)');
    getSpotifyTrack.mockResolvedValue([sampleTrack, { id: 'other' }]);

    const response = await request(app).get('/getSong').query({ video_id: 'yt-123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ body: sampleTrack });
    expect(getYoutubeTitle).toHaveBeenCalledWith('yt-123');
    expect(getSpotifyTrack).toHaveBeenCalledWith('Artist  Song ');
  });

  it('returns 404 when Spotify has no matching tracks', async () => {
    getYoutubeTitle.mockResolvedValue('Rare B-Side');
    getSpotifyTrack.mockResolvedValue([]);

    const response = await request(app).get('/getSong').query({ video_id: 'yt-404' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: { message: 'No matching track found on Spotify.' },
    });
  });

  it('returns 500 with a generic message when upstream lookup fails', async () => {
    getYoutubeTitle.mockRejectedValue(new Error('YouTube unavailable'));

    const response = await request(app).get('/getSong').query({ video_id: 'yt-500' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: { message: 'Could not look up this song right now. Try again in a moment.' },
    });
  });
});
