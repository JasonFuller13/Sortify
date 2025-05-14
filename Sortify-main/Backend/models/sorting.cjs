function euclideanDistance(point1, point2) {
  if (point1.length !== point2.length) {
    throw new Error("Points do not have the same dimensions");
  }
  const squaredDiffs = point1.map((val, i) => (val - point2[i]) ** 2);
  return Math.sqrt(squaredDiffs.reduce((acc, val) => acc + val, 0));
}

// takes a list of songs, formats them to be used for sorting
function formatSongDetails(songs) {
  return songs.map((song) => {
    // Extract only the required artist details (assuming only the first artist is needed)
    const artist = song.artists.map(({ name, id }) => ({ name, id }))[0];

    // Extract the required audio features
    const {
      danceability,
      energy,
      speechiness,
      acousticness,
      instrumentalness,
      liveness,
      valence,
      tempo,
    } = song.features;

    const normalizedTempo = tempo / 200;

    // Return the new structure with only the specified fields
    return {
      name: song.name,
      id: song.id,
      artist,
      uri: song.uri,
      features: {
        danceability,
        energy,
        speechiness,
        acousticness,
        instrumentalness,
        liveness,
        valence,
        normalizedTempo,
      },
      preview_url: song.preview_url,
      analysis_url: song.features.analysis_url,
    };
  });
}

function calculateCentroid(querySongs) {
  const numSongs = querySongs.length;
  const centroid = {
    danceability: 0,
    energy: 0,
    acousticness: 0,
    instrumentalness: 0,
    speechiness: 0,
    valence: 0,
    normalizedTempo: 0,
    liveness: 0,
  };

  // Sum up the values of each feature across all query songs
  for (const song of querySongs) {
    centroid.danceability += song.features.danceability;
    centroid.energy += song.features.energy;
    centroid.acousticness += song.features.acousticness;
    centroid.instrumentalness += song.features.instrumentalness;
    centroid.liveness += song.features.liveness;
    centroid.speechiness += song.features.speechiness;
    centroid.valence += song.features.valence;
    centroid.normalizedTempo += song.features.normalizedTempo;
  }

  // Calculate the average value for each feature
  for (const feature in centroid) {
    centroid[feature] /= numSongs;
  }

  return centroid;
}

function kNearestNeighbors(data, queryList, k) {
  try {
    const source = formatSongDetails(data);
    const selected = formatSongDetails(queryList);
    const centroid = calculateCentroid(selected);

    // Calculate distance from queryPoint to all others
    const distances = source.map((point, index) => ({
      index: index,
      distance: euclideanDistance(
        Object.values(point.features),
        Object.values(centroid)
      ),
    }));

    // Sort by distance
    distances.sort((a, b) => a.distance - b.distance);

    // Return first k sorted points
    return distances.slice(0, k).map((item) => item.index);
  } catch (error) {
    console.error("Error in kNearestNeighbors:", error);
    return []; // Return an empty array in case of error
  }
}

module.exports = { kNearestNeighbors };
