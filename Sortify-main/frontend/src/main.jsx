import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { LikedSongsProvider } from "./LikedSongsContext.jsx";


ReactDOM.createRoot(document.getElementById("root")).render(
  <LikedSongsProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </LikedSongsProvider>
);
