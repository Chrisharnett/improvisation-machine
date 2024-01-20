import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/NavBar.js";
import HomePage from "./pages/HomePage.js";
import PerformPage from "./pages/PerformPage.js";
import CreatePrompts from "./pages/CreatePrompts.js";
import JoinPerformance from "./pages/JoinPerformance.js";
import PerformerPage from "./pages/PerformerPage.js";
import { PrivateRoute } from "./auth/privateRoute.js";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Navigation loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<WebSocketTest />} />
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
