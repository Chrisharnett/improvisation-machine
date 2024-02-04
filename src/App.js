import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/NavBar.js";
import HomePage from "./pages/HomePage.js";
import PerformPage from "./pages/PerformPage.js";
import CreatePrompts from "./pages/CreatePrompts.js";
import JoinPerformance from "./pages/JoinPerformance.js";
import PerformerPage from "./pages/PerformerPage.js";
import { PrivateRoute } from "./auth/privateRoute.js";
import { useState, useEffect } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const backgrounds = [
      "/Backgrounds/AI_Sax_Band_1.webp",
      "/Backgrounds/AI_Sax_Band_2.webp",
      "/Backgrounds/AI_Sax_Band_3.webp",
      "/Backgrounds/AI_Sax_Band_4.webp",
      "/Backgrounds/AI_Sax_Pics9.png",
    ];

    const randomBackground =
      backgrounds[Math.floor(Math.random() * backgrounds.length)];

    document.body.style.backgroundImage = `url(${randomBackground})`;
    document.body.style.backgroundSize = "cover";

    return () => {
      document.body.style.backgroundImage = null;
    };
  }, []);

  useEffect(() => {}, []);

  return (
    <>
      <BrowserRouter>
        <Navigation
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          userData={userData}
          setUserData={setUserData}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/joinPerformance" element={<JoinPerformance />} />
          <Route path="/performerPage" element={<PerformerPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/performPage" element={<PerformPage />} />
            <Route path="/createPrompts" element={<CreatePrompts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
