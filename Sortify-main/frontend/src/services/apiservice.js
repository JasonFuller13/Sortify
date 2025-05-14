async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) {
    console.error("No refresh token available.");
    return false;
  }

  try {
    const response = await fetch(`http://localhost:5555/refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ refreshToken }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error("Token refresh failed: " + data.error);
    }
    localStorage.setItem("access_token", data.access_token);

    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }
    return true;
  } 
  catch (error) {
    return false;
  }
}

async function callSpotifyAPI(url, options = {}, retryCount = 1) {
  const accessToken = localStorage.getItem("access_token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 && retryCount > 0) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return callSpotifyAPI(url, options, retryCount - 1);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      window.location.href = "/login";
      return null;
    }
  }
  return response.json();
}

export default callSpotifyAPI;
