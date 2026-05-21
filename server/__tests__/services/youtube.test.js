const { getYoutubeTitle } = require('../../services/youtube');

describe('getYoutubeTitle', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('rejects missing or blank video ids', async () => {
    await expect(getYoutubeTitle()).rejects.toThrow('Missing YouTube video id.');
    await expect(getYoutubeTitle('   ')).rejects.toThrow('Missing YouTube video id.');
  });

  it('returns the title when the YouTube API responds successfully', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [{ snippet: { title: '  My Song (Official Video)  ' } }],
      }),
    });

    await expect(getYoutubeTitle('abc123')).resolves.toBe('  My Song (Official Video)  ');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://www.googleapis.com/youtube/v3/videos?')
    );
    const url = global.fetch.mock.calls[0][0];
    expect(url).toContain('id=abc123');
  });

  it('throws when the YouTube API returns an error', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 403,
      statusText: 'Forbidden',
      json: async () => ({ error: { message: 'API key invalid' } }),
    });

    await expect(getYoutubeTitle('abc123')).rejects.toThrow('API key invalid');
  });

  it('throws when no video items are returned', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });

    await expect(getYoutubeTitle('abc123')).rejects.toThrow(
      'Could not load this YouTube video title.'
    );
  });

  it('throws when the response is missing a title', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ items: [{ snippet: {} }] }),
    });

    await expect(getYoutubeTitle('abc123')).rejects.toThrow('Unexpected YouTube API response.');
  });
});
