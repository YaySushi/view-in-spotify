const { getSpotifyTrack } = require('../../services/spotify');

describe('getSpotifyTrack', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  function mockSpotifyFlow({ auth, search }) {
    global.fetch
      .mockResolvedValueOnce({
        ok: auth.ok ?? true,
        statusText: auth.statusText || 'OK',
        json: async () => auth.body,
      })
      .mockResolvedValueOnce({
        ok: search.ok ?? true,
        statusText: search.statusText || 'OK',
        json: async () => search.body,
      });
  }

  it('authenticates and returns track items from search', async () => {
    const tracks = [{ id: 'track-1', name: 'Example Song' }];
    mockSpotifyFlow({
      auth: { body: { access_token: 'token-123' } },
      search: { body: { tracks: { items: tracks } } },
    });

    await expect(getSpotifyTrack('Example Song')).resolves.toEqual(tracks);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      'https://accounts.spotify.com/api/token',
      expect.objectContaining({ method: 'POST' })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('https://api.spotify.com/v1/search?'),
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: 'Bearer token-123' },
      })
    );
  });

  it('throws when Spotify authentication fails', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'invalid_client' }),
    });

    await expect(getSpotifyTrack('Example Song')).rejects.toThrow('invalid_client');
  });

  it('throws when authentication succeeds without an access token', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    await expect(getSpotifyTrack('Example Song')).rejects.toThrow(
      'Spotify authentication failed.'
    );
  });

  it('throws when the search request fails', async () => {
    mockSpotifyFlow({
      auth: { body: { access_token: 'token-123' } },
      search: {
        ok: false,
        statusText: 'Bad Gateway',
        body: { error: { message: 'upstream error' } },
      },
    });

    await expect(getSpotifyTrack('Example Song')).rejects.toThrow('upstream error');
  });

  it('throws when the search response has no tracks array', async () => {
    mockSpotifyFlow({
      auth: { body: { access_token: 'token-123' } },
      search: { body: {} },
    });

    await expect(getSpotifyTrack('Example Song')).rejects.toThrow('Unexpected Spotify response.');
  });
});
