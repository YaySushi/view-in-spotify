function cleanVideoName(videoName) {
  // Strip decorations like "(Official Video)" that reduce Spotify search quality.
  videoName = videoName.replaceAll('-', "");
  videoName = videoName.replaceAll('"', "");
  videoName = videoName.replace(/\([\s\S]*\)/g, "");
  videoName = videoName.replace(/\[[\s\S]*\]/g, "");
  return videoName;
}

function sendError(res, statusCode, message) {
  return res.status(statusCode).json({ error: { message } });
}

module.exports = {
  cleanVideoName,
  sendError,
};
