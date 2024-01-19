import { useState, useEffect, useCallback } from "react";
import { Card, Button } from "react-bootstrap";
import useWebSocket from "../hooks/useWebSocket.js";

const PromptCard = ({
  performanceCode,
  setPerformanceCode,
  isLoading,
  message,
  setMessage,
  songEnd,
  setSongEnd,
}) => {
  const [prompt, setPrompt] = useState(null);
  const [ignore, setIgnore] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState(null);
  const [logPrompt, setLogPrompt] = useState(null);

  const endSong = () => {
    setSongEnd(true);
    //log Performance - probably a modal
    // Maybe move logging functionality outside, or here.
    // setPerformanceCode(null);
  };

  const handleWebSocketMessage = useCallback((event) => {
    try {
      if (event.data !== "") {
        const response = JSON.parse(event.data);
        if (response.prompt) {
          const newPrompt = JSON.parse(response.prompt.body);
          setPrompt(newPrompt);
          if (newPrompt.Tags.includes("End-Only")) {
            endSong();
          }
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
          include_tags: [],
          ignore_tags: ["Ignore"],
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
    setIgnore(false);
    setPrompt({ Prompt: "New prompt requested." });
    sendMessage(
      JSON.stringify({
        action: "sendPrompt",
        include_tags: [],
        ignore_tags: ["Ignore"],
      })
    );
  };

  const handleIgnorePrompt = () => {
    setIgnore(true);
    handleNextPrompt();
  };

  const handleEndSong = () => {
    sendMessage(
      JSON.stringify({
        action: "sendEndingPrompt",
        include_tags: ["End", "End-Only"],
        ignore_tags: ["Ignore"],
      })
    );
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
            <Card.Title className="fs-1">{message}</Card.Title>
          )}
          <Card.Text className=""></Card.Text>
          {
            <>
              <Button
                type="submit"
                className="mx-2"
                onClick={handleNextPrompt}
                disabled={!prompt}
              >
                Next Prompt
              </Button>
              <Button
                type="submit"
                className="mx-2"
                onClick={handleEndSong}
                disabled={!prompt}
              >
                End Song
              </Button>
              <Button
                type="submit"
                variant="danger"
                className="mx-2"
                onClick={handleIgnorePrompt}
                disabled={!prompt}
              >
                Ignore Prompt
              </Button>
            </>
          }
        </Card.Body>
      </Card>
    </>
  );
};

export default PromptCard;
