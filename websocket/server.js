// server.js

const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8765 });

server.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log(`Received message: ${message}`);
    // Echo the received message back to the client
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error: ${error.message}`);
  });
});

console.log("WebSocket server started on ws://localhost:8765");
