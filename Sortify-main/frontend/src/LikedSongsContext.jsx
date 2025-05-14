import { useEffect, createContext, useState, useContext } from "react";

const LikedSongsContext = createContext();

export const useLikedSongs = () => useContext(LikedSongsContext);

export const LikedSongsProvider = ({ children }) => {
  const [likedSongs, setLikedSongs] = useState(() => {
    const storedLikedSongs = sessionStorage.getItem("likedSongs");
    return storedLikedSongs && storedLikedSongs !== "undefined" ? JSON.parse(storedLikedSongs) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("likedSongs", JSON.stringify(likedSongs));
  }, [likedSongs]);

  return (
    <LikedSongsContext.Provider value={{likedSongs, setLikedSongs}}>
      {children}
    </LikedSongsContext.Provider>
  );
};
