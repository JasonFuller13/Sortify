const express = require("express");
const router = express.Router();
/**
 * Adds tracks to an existing playlist in the user's Spotify account.
 *
 * @param {string} accessToken - The Spotify access token.
 * @param {string} playlistId - The Spotify ID of the playlist to update.
 * @param {string[]} trackUris - Array of Spotify track URIs to add to the playlist.
 */
async function updatePlaylistOnSpotify(accessToken, playlistId, trackUris) {
  try {
    // Add tracks to the existing playlist
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: trackUris }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to add tracks to playlist: ${response.statusText}`
      );
    }

    console.log(
      `Tracks added to the existing playlist. Playlist ID: ${playlistId}`
    );
    return playlistId; // Return the updated playlist ID for further use
  } catch (error) {
    console.error("Error updating playlist on Spotify:", error);
  }
}

/**
 * Creates a new playlist in the user's Spotify account and adds tracks to it.
 *
 * @param {string} userId - The Spotify user ID.
 * @param {string} accessToken - The Spotify access token.
 * @param {Object} playlistDetails - Details of the playlist to create.
 * @param {string[]} trackUris - Array of Spotify track URIs to add to the playlist.
 */
async function exportPlaylistToSpotify(
  userId,
  accessToken,
  playlistDetails,
  trackUris
) {
  try {
    // Step 1: Create a new playlist
    const createPlaylistResponse = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistDetails.name,
          description: playlistDetails.description || "",
          public: playlistDetails.public || false,
        }),
      }
    );

    if (!createPlaylistResponse.ok) {
      throw new Error(
        `Failed to create playlist: ${createPlaylistResponse.statusText}`
      );
    }

    const playlist = await createPlaylistResponse.json();

    // Step 2: Add tracks to the playlist
    const addTracksResponse = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          position: 0,
          uris: trackUris,
        }),
      }
    );

    if (!addTracksResponse.ok) {
      throw new Error(
        `Failed to add tracks to playlist: ${addTracksResponse.statusText}`
      );
    }

    console.log(
      `Playlist created and tracks added. Playlist ID: ${playlist.id}`
    );
    return playlist.id;
  } catch (error) {
    console.error("Error exporting playlist to Spotify:", error);
  }
}

module.exports = exportPlaylistToSpotify;
