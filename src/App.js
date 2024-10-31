import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
import axios from "axios";
import useUser from "./auth/useUser.js";

function App() {
  const [token, saveToken, removeToken] = useToken();
  const [error, setError] = useState(null);
  const [LogInUrl] = useState(getCognitoURL());
  const [currentPlayer, setCurrentPlayer] = useState({});
  const loggedIn = useMemo(() => !!token, [token]);
  const [codeProcessed, setCodeProcessed] = useState(false);
  const { sendMessage, incomingMessage } = useWebSocket();
  const user = useUser();

  // Handle token exchange from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code && !codeProcessed) {
      codeForToken(code);
      setCodeProcessed(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const codeForToken = async (code) => {
    try {
      const callback =
        process.env.REACT_APP_ENV === "prod"
          ? process.env.REACT_APP_COGNITO_CALLBACK_PROD
          : process.env.REACT_APP_COGNITO_CALLBACK_LOCAL;
      const response = await axios.post(
        `${process.env.REACT_APP_AUTH_API}`,
        JSON.stringify({
          code: code,
          redirect_uri: callback,
        })
      );
      const newToken = response.data;

      saveToken(newToken);
    } catch (error) {
      console.error("Error fetching token:", error);
      setError(error);
    }
  };

  const logOutHandler = () => {
    removeToken();
    window.location.href = "/";
  };

  const logInHandler = () => {
    window.location.href = LogInUrl;
  };

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
        logInHandler={logInHandler}
        logOutHandler={logOutHandler}
        currentPlayer={currentPlayer}
      />
      <Spacer />
      <Routes>
        <Route
          path="/"
          element={
            loggedIn ? (
              <Navigate to="/performPage" replace />
            ) : (
              <HomePage loggedIn={loggedIn} />
            )
          }
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/performPage"
          element={
            <PrivateRoute redirectPath="/">
              <PerformPage
                loggedIn={loggedIn}
                LogInUrl={LogInUrl}
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/playerProfile"
          element={
            <PrivateRoute redirectPath="/">
              <PlayerProfile
                currentPlayer={currentPlayer}
                setCurrentPlayer={setCurrentPlayer}
              />
            </PrivateRoute>
          }
        />
      </Routes>
      <Spacer />
    </BrowserRouter>
  );
}

export default App;
