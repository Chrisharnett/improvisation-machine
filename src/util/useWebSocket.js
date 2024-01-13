import { useState, useEffect } from "react";

const useWebSocket = ({ setPrompt }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_API);

    webSocket.onopen = () => {
      console.log("Websocket connection established.");
    };

    webSocket.onmessage = (event) => {
      const receivedPrompt = JSON.parse(event.data);
      setPrompt(receivedPrompt);
    };

    webSocket.onerror = (event) => {
      console.error("WebSocket error: ", event);
    };

    webSocket.onclose = () => {
      console.log("Websocket connection closed");
    };

    setWs(webSocket);

    return () => {
      webSocket.close();
    };
  }, [setPrompt]);

  return ws;
};

export default useWebSocket;
