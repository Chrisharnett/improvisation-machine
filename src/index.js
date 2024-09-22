import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { WebSocketProvider } from "./util/WebSocketContext.js";

const websocketURL =
  process.env.REACT_APP_ENV === "prod"
    ? process.env.REACT_APP_WEBSOCKET_API_PROD
    : process.env.REACT_APP_WEBSOCKET_API_LOCAL;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WebSocketProvider url={websocketURL}>
      <App />
    </WebSocketProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
