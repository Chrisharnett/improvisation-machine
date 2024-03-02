import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/NavBar.js";
import HomePage from "./pages/HomePage.js";
import PerformPage from "./pages/PerformPage.js";
import CreatePrompts from "./pages/CreatePrompts.js";
// import JoinPerformance from "./pages/JoinPerformance.js";
import JoinOrCreatePerformance from "./pages/JoinOrCreatePerformance.js";
import { PrivateRoute } from "./auth/privateRoute.js";
import { useState, useEffect } from "react";
import { Backgrounds } from "./util/Backgrounds.js";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const randomBackground =
      Backgrounds[Math.floor(Math.random() * Backgrounds.length)];

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
          <Route
            path="/"
            element={<HomePage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          {/* <Route path="/joinPerformance" element={<JoinPerformance />} /> */}
          <Route path="/performPage" element={<PerformPage />} />
          <Route element={<PrivateRoute />}>
            <Route
              path="/joinOrCreatePerformance"
              element={<JoinOrCreatePerformance userData={userData} />}
            />
            <Route path="/createPrompts" element={<CreatePrompts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
