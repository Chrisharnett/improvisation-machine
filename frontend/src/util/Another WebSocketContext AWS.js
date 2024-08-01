import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
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

  const connect = useCallback(() => {
    if (ws.current) {
      ws.current.close();
    }
    if (token) {
      const wsUrl = `${url}?token=${encodeURIComponent(
        token
      )}&performance_id=${encodeURIComponent(performanceId)}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log("WebSocket connection established.");
        setIsConnected(true);
      };

      ws.current.onclose = (event) => {
        console.log(
          "WebSocket connection closed. Code:",
          event.code,
          "Reason:",
          event.reason
        );
        setIsConnected(false);
        // if (event.code !== 1000) {
        //   setTimeout(() => connect(), 5000);
        // }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onmessage = (event) => {
        if (messageHandler) {
          messageHandler(event);
          console.log("WebSocket message received:", event.data);
        } else {
          console.warn("Message received but no handler is set");
        }
      };
    }
  }, [url, token, performanceId, messageHandler]);

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

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
