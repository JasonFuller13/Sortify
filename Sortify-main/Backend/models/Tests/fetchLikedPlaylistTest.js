const accessToken = "YOUR_SPOTIFY_ACCESS_TOKEN_HERE"; // Replace with your actual access token

const {
  fetchLikedSongs,
  fetchArtistsGenres,
  fetchSongDetails,
  fetchUserPlaylists,
} = require("../songandplaylistroutes.cjs"); // Adjust the path as necessary

// Test fetchLikedSongs
async function testFetchLikedSongs() {
  console.log("Testing fetchLikedSongs...");
  const likedSongs = await fetchLikedSongs(accessToken);
  console.log(`Fetched ${likedSongs.length} liked songs.`);
  console.log(likedSongs.slice(0, 2)); // Log the first two for inspection
  return likedSongs; // Return for further tests
}

// Test fetchArtistsGenres
async function testFetchArtistsGenres(likedSongs) {
  console.log("Testing fetchArtistsGenres...");
  const artistIds = likedSongs.flatMap((song) => song.artistIds).slice(0, 10); // Take only a subset to limit requests
  const artistGenres = await fetchArtistsGenres(artistIds, accessToken);
  console.log(`Fetched genres for ${artistGenres.length} artists.`);
  console.log(artistGenres.slice(0, 2)); // Log the first two for inspection
}

// Test fetchSongDetails
async function testFetchSongDetails(likedSongs) {
  console.log("Testing fetchSongDetails...");
  const detailedSongs = await fetchSongDetails(
    likedSongs.slice(0, 5),
    accessToken
  ); // Test with a subset
  console.log(
    `Fetched detailed information for ${detailedSongs.length} songs.`
  );
  console.log(detailedSongs.slice(0, 2)); // Log the first two for inspection
}

// Test fetchUserPlaylists
async function testFetchUserPlaylists() {
  console.log("Testing fetchUserPlaylists...");
  const playlists = await fetchUserPlaylists(accessToken);
  console.log(`Fetched ${playlists.length} playlists.`);
  console.log(playlists.slice(0, 2)); // Log the first two for inspection
}

async function runTests() {
  try {
    // Run tests sequentially to respect potential rate limits and dependencies
    const likedSongs = await testFetchLikedSongs();
    await testFetchArtistsGenres(likedSongs);
    await testFetchSongDetails(likedSongs);
    await testFetchUserPlaylists();
  } catch (error) {
    console.error("Error during tests:", error);
  }
}

runTests();
