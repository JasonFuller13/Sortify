import { useState, useEffect } from "react";
import "./dashboard.css";
import PlaylistComponent from "./playlist-component.jsx";
import callSpotifyAPI from "./../services/apiservice.js";
import Joyride from "react-joyride";
import { useLikedSongs } from "../LikedSongsContext.jsx";
import CircularIndeterminate from "../loading-circle.jsx";
import Popup from "../playlistcreation/Popup.jsx";

export default function Dashboard() {
  const { likedSongs, setLikedSongs } = useLikedSongs();
  const accessToken = localStorage.getItem("access_token");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runTutorial, setRunTutorial] = useState(true);
  const [openPopup, setOpenPopup] = useState(false);
  const [steps, setSteps] = useState([
    {
      target: "body",
      content:
        "The app that allows you to sort your Spotify song library into customized playlists.",
      placement: "center",
      title: <strong>Welcome to Sortify!</strong>,
    },
    {
      target: "body",
      content:
        "Here you can choose to create a new playlist or select one to update.",
      placement: "center",
      title: <strong>Create or Update Playlists</strong>,
    },
    {
      target: ".create-new-playlist-card",
      content:
        "Create a new playlist by selecting five songs from your library. These selections will serve as the foundation for the rest of your generated playlist.",
      placement: "center",
      title: <strong>Create New Playlist</strong>,
    },
    {
      target: ".first-playlist-card",
      content:
        "Updating a playlist will assess the vibe of that existing playlist and add similar songs from your existing music library.",
      placement: "center",
      title: <strong>Update Playlist</strong>,
    },
    {
      target: "body",
      content: "Start creating your personalized playlists now.",
      placement: "center",
      title: <strong>You're all set!</strong>,
    },
  ]);

  useEffect(() => {
    async function fetchLikedSongs() {
      if (accessToken) {
        setIsLoading(true);
        try {
          const response = await fetch("/api/fetch-liked-songs-and-details", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch liked songs: ${response.status}`);
          }
          const data = await response.json();
          setLikedSongs(data.likedSongs);
        } catch (error) {
          console.error("Error fetching liked songs:", error);
          setError(error.message || "An unexpected error occurred");
        } finally {
          setIsLoading(false);
        }
      }
    }
    async function getSpotifyProfilePicture() {
      try {
        const data = await callSpotifyAPI("https://api.spotify.com/v1/me");
        localStorage.setItem("userId", data.id);
        if (data.images.length > 0) {
          const largestImage = data.images.sort((a, b) => b.width - a.width)[0];
          setProfilePicture(largestImage.url);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }

    if (!profilePicture) {
      getSpotifyProfilePicture();
    }

    if (likedSongs.length == 0 && accessToken) {
      fetchLikedSongs();
    }
  }, [accessToken, setLikedSongs, likedSongs, profilePicture]);

  if (isLoading) {
    return (
      <>
        <CircularIndeterminate message="Getting your music" />
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <Joyride
        continuous
        run={runTutorial}
        steps={steps}
        showSkipButton={true}
        showProgress={true}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#f04", // This changes the default color theme, affecting the Next button
          },
          buttonNext: {
            backgroundColor: "#95D5B2", // Specific customization for the Next button's background color
            color: "#fff", // Specific customization for the Next button's text color
          },
          buttonBack: {
            backgroundColor: "#fff", // Setting the Back button's background to black
            color: "#000", // Setting the Back button's text color to white
          },
        }}
      />

      <div className="profile-section">
        <img
          src={profilePicture}
          alt="Spotify Profile"
          className="profile-image"
        />
      </div>

      <div className="instructions mb-0">
        <h1 onClick={() => setOpenPopup(true)}>
          Create A New Playlist OR Select One To Update!
        </h1>
      </div>

      <div className="select-playlists mt-5">
        <h2 className="text-black"></h2>
        <PlaylistComponent accessToken={accessToken} />
      </div>
      <Popup
        title="Update Playlist"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
      />
    </div>
  );
}
