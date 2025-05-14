import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    if (accessToken && refreshToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return <div>Loading...</div>;
};

export default Callback;
