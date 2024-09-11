import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./components/NavBar.js";
import HomePage from "./pages/HomePage.js";
import PerformPage from "./pages/PerformPage.js";
// import { PrivateRoute } from "./auth/privateRoute.js";
import { Backgrounds } from "./util/Backgrounds.js";
import { WebSocketProvider } from "./util/WebSocketContext.js";
import { useToken } from "./auth/useToken.js";
import getCognitoURL from "./auth/getCognitoURL.js";
import About from "./pages/About.js";

const websocketURL = process.env.REACT_APP_WEBSOCKET_API_LOCAL;

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, saveToken, removeToken] = useToken();
  const [error, setError] = useState(null);
  const [LogInUrl, setLogInUrl] = useState(getCognitoURL());

  // Get a random background image.
  useEffect(() => {
    const randomBackground =
      Backgrounds[Math.floor(Math.random() * Backgrounds.length)];

    document.body.style.backgroundImage = `url(${randomBackground})`;
    document.body.style.backgroundSize = "cover";

    return () => {
      document.body.style.backgroundImage = null;
    };
  }, []);

  return (
    <BrowserRouter>
      <Navigation
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        token={token}
        saveToken={saveToken}
        removeToken={removeToken}
        setError={setError}
        LogInUrl={LogInUrl}
      />
      <Routes>
        <Route
          path="/"
          element={<HomePage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/performPage"
          element={
            <WebSocketProvider url={websocketURL}>
              <PerformPage loggedIn={loggedIn} LogInUrl={LogInUrl} />
            </WebSocketProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
