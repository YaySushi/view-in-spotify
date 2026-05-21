const { cleanVideoName, sendError } = require('../helpers');

describe('cleanVideoName', () => {
  it('removes hyphens and double quotes', () => {
    expect(cleanVideoName('Artist - "Song Title"')).toBe('Artist  Song Title');
  });

  it('removes parenthetical segments', () => {
    expect(cleanVideoName('Song Title (Official Video)')).toBe('Song Title ');
  });

  it('removes bracketed segments', () => {
    expect(cleanVideoName('Song Title [HD Remaster]')).toBe('Song Title ');
  });

  it('applies all cleaning rules together', () => {
    expect(cleanVideoName('Artist - "Hit" (Live) [4K]')).toBe('Artist  Hit  ');
  });
});

describe('sendError', () => {
  it('responds with the given status and error message shape', () => {
    const json = jest.fn();
    const status = jest.fn(() => ({ json }));

    sendError({ status }, 404, 'Not found');

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: { message: 'Not found' } });
  });
});
