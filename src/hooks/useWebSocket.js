import { useRef, useEffect } from "react";

const useWebSocket = (url, onMessageHandler) => {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    const webSocket = ws.current;

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

    return () => {
      webSocket.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    console.log("ws: ", ws);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  return { ws, sendMessage };
};

export default useWebSocket;
