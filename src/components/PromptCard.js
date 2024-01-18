import { useState, useEffect, useCallback } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import useWebSocket from "../hooks/useWebSocket.js";

const PromptCard = ({ performanceCode, isLoading }) => {
  const [prompt, setPrompt] = useState(null);
  const [ignore, setIgnore] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState(null);
  const [logPrompt, setLogPrompt] = useState(null);

  const handleWebSocketMessage = useCallback((event) => {
    try {
      const response = JSON.parse(event.data);
      setPrompt(response.prompt);
      setStartTime(new Date().toISOString());
    } catch (e) {
      setError(e);
    }
  }, []);

  const { ws, sendMessage } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_API,
    handleWebSocketMessage
  );

  const handleNextPrompt = () => {
    const newEndTime = new Date().toISOString();
    setEndTime(newEndTime);
    setLogPrompt({
      performanceCode,
      ...prompt,
      startTime: startTime,
      endTime: newEndTime,
      ignore: ignore,
    });
    sendMessage(JSON.stringify({ action: "sendPrompt" }));
    setIgnore(false);
  };

  const handleIgnorePrompt = () => {
    setIgnore(true);
    handleNextPrompt();
  };

  if (error) return <div>Error loading data.</div>;

  return (
    <>
      <Card style={{ width: "50rem" }} className="m-5 text-center">
        <Card.Body className="align-items-center">
          {prompt && (
            <Card.Title className="fs-1">{prompt.body.Prompt}</Card.Title>
          )}
          {!prompt && isLoading && (
            <Card.Title className="fs-1">Loading...</Card.Title>
          )}
          {!prompt && !isLoading && (
            <Card.Title className="fs-1">
              Click "Begin Song" to start
            </Card.Title>
          )}
          <Card.Text className=""></Card.Text>
          {prompt && (
            <>
              <Button type="submit" className="mx-2" onClick={handleNextPrompt}>
                Next Prompt
              </Button>
              <Button
                type="submit"
                variant="danger"
                className="mx-2"
                onClick={handleIgnorePrompt}
              >
                Ignore Prompt
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default PromptCard;

// const fetchPrompt = async () => {
//   try {
//     const response = await axios.get(`${process.env.REACT_APP_PROMPT_API}`);
//     setPrompt(response.data);
//     const startTime = new Date().toISOString();
//     setStartTime(startTime);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     setError(error);
//   }
// };
// useEffect(() => {
//   fetchPrompt();
// }, []);

// const sendMessage = (message) => {
//   if (ws && ws.readyState === WebSocket.OPEN) {
//     ws.send(message);
//   }
// };

// useEffect(() => {
//   if (performanceCode) {
//     ws.onmessage = (event) => {
//       try {
//         const receivedPrompt = JSON.parse(event.data);
//         setPrompt(receivedPrompt);
//         setStartTime(new Date().toISOString());
//       } catch (e) {
//         setError(e);
//       }
//     };
//   }
// }, [performanceCode, ws]);

// const onMessageReceived = (event) => {
//   try {
//     const receivedPrompt = JSON.parse(event.data);
//     setPrompt(receivedPrompt);
//     setStartTime(new Date().toIseString());
//   } catch (e) {
//     setError(e);
//   }
// };
