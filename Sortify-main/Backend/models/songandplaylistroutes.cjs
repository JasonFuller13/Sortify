const express = require("express");
const router = express.Router();
const { kNearestNeighbors } = require("./sorting.cjs");
const exportPlaylistToSpotify = require("./exportPlaylist.cjs");

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function fetchWithRetry(url, accessToken) {
  let response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 429) {
    // 429 is the status code for rate limiting
    console.log(
      "fetching failed - 429 error retry-after is ",
      response.headers.get("Retry-After")
    );
    const retryAfter = parseInt(response.headers.get("Retry-After"));
    if (retryAfter) {
      await sleep(retryAfter);
      return fetchWithRetry(url, accessToken); // Recursively retry the request after the specified delay
    }
  }

  return response;
}

const fetchUserPlaylists = async (accessToken) => {
  const playlists = [];
  let url = "https://api.spotify.com/v1/me/playlists?limit=50";

  while (url) {
    try {
      const response = await fetchWithRetry(url, accessToken);
      const data = await response.json();
      playlists.push(
        ...data.items.map((item) => {
          return {
            playlistId: item.id,
            name: item.name,
            tracksHref: item.tracks.href,
            imageUrl: item.images && item.images[0] ? item.images[0].url : null,
          };
        })
      );
      url = data.next;
    } catch (error) {
      console.error("Failed to fetch or process playlists:", error);
      break; // Exit the loop in case of an error
    }
  }
  return playlists;
};

async function fetchLikedSongs(accessToken) {
  let likedSongs = [];
  let url = "https://api.spotify.com/v1/me/tracks?limit=50"; // Starting URL, increased limit to 50
  while (url) {
    const response = await fetchWithRetry(url, accessToken);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const batchOfSongs = data.items.map((item) => ({
      name: item.track.name,
      id: item.track.id,
      artistIds: item.track.artists.map((artist) => artist.id),
    }));

    likedSongs = likedSongs.concat(batchOfSongs);

    url = data.next; // Update the URL for the next request
  }

  return likedSongs;
}

async function fetchArtistsGenres(artistIds, accessToken) {
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Splitting artistIds into chunks of 50
  const artistIdChunks = chunkArray(artistIds, 50);

  const fetchGenresForChunk = async (idsChunk) => {
    const endpoint = `https://api.spotify.com/v1/artists?ids=${idsChunk.join(
      ","
    )}`;
    const response = await fetchWithRetry(endpoint, accessToken);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.artists.map((artist) => ({
      id: artist.id,
      genres: artist.genres,
    }));
  };

  // Fetch genres for all chunks using Promise.all to handle them in parallel
  const results = await Promise.all(
    artistIdChunks.map((idsChunk) => fetchGenresForChunk(idsChunk))
  );

  // Flattening the results array as it will be an array of arrays
  const flattenedResults = results.flat();

  return flattenedResults;
}

async function fetchSongDetails(songList, accessToken) {
  // Function to chunk an array into smaller arrays of a specified size
  const chunkArray = (array, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Get an array of song ids from likedSongs
  const songIds = songList.map((song) => song.id);

  // Split songIds into chunks of 100
  const songIdChunks = chunkArray(songIds, 50);

  // Now, songIdChunks is a 2d array, where each sub-array has up to 100 song IDs.
  const trackIdStrings = songIdChunks.map((chunk) => chunk.join(","));

  // Initialize arrays to hold the responses for tracks and features
  let allTrackDetails = [];
  let allFeaturesDetails = [];

  for (let index = 0; index < trackIdStrings.length; index++) {
    const trackIdString = trackIdStrings[index];
    try {
      // Fetch track details for the current chunk
      const trackResponse = await fetchWithRetry(
        `https://api.spotify.com/v1/tracks?ids=${trackIdString}`,
        accessToken
      );

      const featuresResponse = await fetchWithRetry(
        `https://api.spotify.com/v1/audio-features?ids=${trackIdString}`,
        accessToken
      );

      const trackData = await trackResponse.json();
      const featuresData = await featuresResponse.json();

      allTrackDetails.push(...trackData.tracks);
      allFeaturesDetails.push(...featuresData.audio_features);
    } catch (error) {
      console.error(`Error fetching data for chunk: `, index, error);
      // Handle error, for example by breaking the loop or continuing to the next chunk
    }
  }

  // At this point, allTrackDetails and allFeaturesDetails contain the details and features for all tracks
  const detailedSongs = allTrackDetails.map((track, index) => {
    const { album, available_markets, duration_ms, ...rest } = track;
    // Map over the artists to include only their name and id
    const simplifiedArtists = track.artists.map(({ name, id }) => ({
      name,
      id,
    }));
    return {
      ...rest,
      artists: simplifiedArtists,
      features: allFeaturesDetails[index],
    };
  });

  return detailedSongs;
}

async function generatePlaylist(sourceData, sampleData) {
  const tracks = await kNearestNeighbors(sourceData, sampleData, 50);
  console.log(tracks);
  return tracks;
}

router.get("/fetch-playlists", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No authorization token provided" });
    }
    const accessToken = req.header("Authorization").split(" ")[1];

    const playlists = await fetchUserPlaylists(accessToken);
    res.json({
      success: true,
      playlists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user playlists",
    });
  }
});

router.get("/fetch-liked-songs-and-details", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "No authorization token provided" });
    }
    const accessToken = req.header("Authorization").split(" ")[1];

    const likedSongs = await fetchLikedSongs(accessToken);

    const songDetails = await fetchSongDetails(likedSongs, accessToken);

    res.json({
      success: true,
      likedSongs: songDetails,
    });
  } catch (error) {
    console.error("Error fetching liked songs and details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch liked songs and details",
    });
  }
});

router.post("/create-playlist", async (req, res) => {
  const userId = req.body.userId;
  const accessToken = req.header("Authorization").split(" ")[1];
  const playlistDetails = req.body.playlistDetails;
  const sourceData = req.body.sourceData;
  const sampleData = req.body.sampleData;

  const knnInfo = await generatePlaylist(sourceData, sampleData);
  const trackUris = knnInfo.map((item) => sourceData[item].uri);

  try {
    const playlistId = await exportPlaylistToSpotify(
      userId,
      accessToken,
      playlistDetails,
      trackUris
    );
    res.json({
      success: true,
      playlistId: playlistId,
      message: "Playlist created successfully",
    });
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create playlist",
    });
  }
});

router.post("/update-playlist", async (req, res) => {
  const accessToken = req.header("Authorization").split(" ")[1];
  const playlistId = req.body.playlistId;
  const trackUris = req.body.trackUris;

  try {
    const updatedPlaylistId = await updatePlaylistOnSpotify(
      accessToken,
      playlistId,
      trackUris
    );
    res.json({
      success: true,
      playlistId: updatedPlaylistId,
      message: "Playlist updated successfully",
    });
  } catch (error) {
    console.error("Error updating playlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update playlist",
    });
  }
});

module.exports = router;
