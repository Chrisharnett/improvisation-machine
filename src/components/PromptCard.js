import { useState, useEffect, useCallback } from "react";
import { Card, Button } from "react-bootstrap";
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
      if (event.data !== "") {
        const response = JSON.parse(event.data);
        if (response.prompt) {
          setPrompt(response.prompt.body);
          setStartTime(new Date().toISOString());
        }
      }
    } catch (e) {
      setError(e);
    }
  }, []);

  const { ws, sendMessage } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_API,
    handleWebSocketMessage
  );

  useEffect(() => {
    if (performanceCode) {
      sendMessage(
        JSON.stringify({
          action: "sendPrompt",
          message: "testing only this line can probably be deleted.",
        })
      );
    }
  }, [performanceCode]);

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
    sendMessage(
      JSON.stringify({
        action: "sendPrompt",
        message: "testing only this line can probably be deleted.",
      })
    );
    setIgnore(false);
  };

  const handleIgnorePrompt = () => {
    setIgnore(true);
    handleNextPrompt();
  };

  if (error) {
    console.error(error);
    return <div>Error loading data.</div>;
  }

  return (
    <>
      <Card style={{ width: "50rem" }} className="m-5 text-center">
        <Card.Body className="align-items-center">
          {prompt && <Card.Title className="fs-1">{prompt.Prompt}</Card.Title>}
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
