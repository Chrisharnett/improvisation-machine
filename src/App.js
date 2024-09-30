import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "./components/NavBar.js";
import HomePage from "./pages/HomePage.js";
import PerformPage from "./pages/PerformPage.js";
import { PrivateRoute } from "./auth/privateRoute.js";
import { Backgrounds } from "./util/Backgrounds.js";
import { useToken } from "./auth/useToken.js";
import getCognitoURL from "./auth/getCognitoURL.js";
import About from "./pages/About.js";
import PlayerProfile from "./pages/PlayerProfile.js";
import { Spacer } from "./util/Spacer.js";
import { useWebSocket } from "./util/WebSocketContext.js";
import useUser from "./auth/useUser.js";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, saveToken, removeToken] = useToken();
  const [error, setError] = useState(null);
  const [LogInUrl, setLogInUrl] = useState(getCognitoURL());
  const [currentPlayer, setCurrentPlayer] = useState({});

  const user = useUser();

  const { sendMessage, incomingMessage } = useWebSocket();

  useEffect(() => {
    if (loggedIn && user) {
      const player = {
        ...currentPlayer,
        registeredUser: true,
        userId: user.sub,
      };
      setCurrentPlayer(player);
    }
  }, [loggedIn, user]);

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
        currentPlayer={currentPlayer}
      />
      <Spacer />
      <Routes>
        <Route
          path="/"
          element={<HomePage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/performPage"
          element={
            <PerformPage
              loggedIn={loggedIn}
              LogInUrl={LogInUrl}
              currentPlayer={currentPlayer}
              setCurrentPlayer={setCurrentPlayer}
            />
          }
        />
        <Route element={<PrivateRoute />}>
          <Route
            path="/playerProfile"
            element={
              <PlayerProfile
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
              />
            }
          />
        </Route>
      </Routes>
      <Spacer />
    </BrowserRouter>
  );
}

export default App;
