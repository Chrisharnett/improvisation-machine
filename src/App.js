import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/NavBar.js";
import HomePage from "./pages/HomePage.js";
import PerformPage from "./pages/PerformPage.js";
import CreatePrompts from "./pages/CreatePrompts.js";
import WebSocketTest from "./components/WebSocketTest.js";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<WebSocketTest />} />
          <Route path="/perform" element={<PerformPage />} />
          <Route path="/createPrompts" element={<CreatePrompts />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
