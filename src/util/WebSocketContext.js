import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({
  children,
  url,
  token,
  performanceId = "NO PERFORMANCE",
}) => {
  const ws = useRef(null);
  const [messageHandler, setMessageHandler] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = () => {
    if (ws.current) {
      ws.current.close();
    }
    if (token && performanceId) {
      const wsUrl = `${url}?token=${encodeURIComponent(
        token
      )}&performance_id=${encodeURIComponent(performanceId)}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connection established.");
        setIsConnected(true);
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed.");
        setIsConnected(false);
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onmessage = (event) => {
        if (messageHandler) {
          messageHandler(event);
        }
      };
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url, token, performanceId]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
      console.log("WebSocket message sent:", message);
    } else {
      console.log("WebSocket is not open. Message not sent:", message);
    }
  };

  const onMessage = (handler) => {
    setMessageHandler(() => handler);
  };

  const reconnect = () => {
    if (ws.current) {
      ws.current.close();
    }
    connect();
  };

  const close = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ sendMessage, onMessage, reconnect, close, isConnected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
