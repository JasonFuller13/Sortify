// get song details

// strrip into relevant

// run stripped into knn

// return results

const fetchSongDetails = require("../songandplaylistroutes.cjs");
const kNearestNeighbors = require("../sorting.cjs");

async function testSorting(selectedSongs) {
  const source = await callSpotifyAPI("/api/fetch-liked-songs");
  const selected = selectedSongs;

  return kNearestNeighbors(source, selected);
}
