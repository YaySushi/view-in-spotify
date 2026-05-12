function cleanVideoName(videoName) {
  // Strip decorations like "(Official Video)" that reduce Spotify search quality.
  videoName = videoName.replaceAll('-', "");
  videoName = videoName.replaceAll('"', "");
  videoName = videoName.replace(/\([\s\S]*\)/g, "");
  videoName = videoName.replace(/\[[\s\S]*\]/g, "");
  return videoName;
}

module.exports = {
  cleanVideoName,
};
