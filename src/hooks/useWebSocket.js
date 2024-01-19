import { useState, useEffect } from "react";

const useWebSocket = (url, onMessageHandler) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const webSocket = new WebSocket(url);

    webSocket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    webSocket.onmessage = (event) => {
      if (onMessageHandler) {
        onMessageHandler(event);
      }
    };

    webSocket.onerror = (event) => {
      console.log(event);
      console.error("WebSocket error: ", event);
    };

    webSocket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(webSocket);

    return () => {
      webSocket.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  return { ws, sendMessage };
};

export default useWebSocket;
