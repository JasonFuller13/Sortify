const { exportPlaylistToSpotify, updatePlaylistOnSpotify } = require('./exportPlaylist');

const userId = 'your_spotify_user_id_here'; // Replace with your Spotify user ID
const accessToken = 'your_spotify_access_token_here'; // Replace with your actual access token

// Details for the new playlist
const playlistDetails = {
    name: 'Test Playlist',
    description: 'A playlist created for testing.',
    public: false // Set to true if you want the playlist to be public
};

// Track URIs to add to the new playlist
const initialTrackUris = [
    'spotify:track:4iV5W9uYEdYUVa79Axb7Rh', // Replace these URIs with those you wish to add
    'spotify:track:1301WleyT98MSxVHPZCA6M'
];

// Additional track URIs to update the playlist with
const additionalTrackUris = [
    'spotify:track:6rqhFgbbKwnb9MLmUQDhG6', // Replace these URIs with additional tracks
    'spotify:track:1VZedwJj1gyi88WFRhfThb'
];

// Function to test creating and updating a Spotify playlist
async function testExportAndUpdatePlaylist() {
    try {
        // Create a new playlist and add initial tracks
        console.log("Creating a new playlist...");
        const newPlaylistId = await exportPlaylistToSpotify(userId, accessToken, playlistDetails, initialTrackUris);
        console.log(`New playlist created successfully: ${newPlaylistId}`);

        // Update the newly created playlist with additional tracks
        console.log("Updating the new playlist with additional tracks...");
        await updatePlaylistOnSpotify(accessToken, newPlaylistId, additionalTrackUris);
        console.log(`Playlist updated successfully: ${newPlaylistId}`);
    } catch (error) {
        console.error('Error during export or update of playlist:', error);
    }
}

// Run the test
testExportAndUpdatePlaylist();
//