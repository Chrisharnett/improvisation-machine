import React, { useEffect } from "react";

const WebSocketTest = () => {
  useEffect(() => {
    const wsUrl = "wss://f87zy1sbli.execute-api.us-east-1.amazonaws.com/prod/";
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
      const sendPromptMessage = {
        action: "sendPrompt",
        message: "Your prompt message here",
      };
      ws.send(JSON.stringify(sendPromptMessage));
      //   const message = "Hello, WebSocket!";
      //   ws.send(message);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      // Check if the received message is a response for the sendPrompt route
      if (data.action === "sendPrompt") {
        console.log("Received sendPrompt response:", data);
        // Handle the response as needed
      }
    };

    ws.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Test</h1>
      <p>Check the console for WebSocket messages.</p>
    </div>
  );
};

export default WebSocketTest;
