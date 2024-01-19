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
  const [error, setError] = useState(null);
  const [logPrompt, setLogPrompt] = useState(null);
  const [nextPrompt, setNextPrompt] = useState(null);

  const endSong = () => {
    setSongEnd(true);
    setPerformanceCode(null);
    //log Performance - probably a modal
    // Maybe move logging functionality outside, or here.
    // setPerformanceCode(null);
  };
  const getNewPrompt = () => {
    console.log("getNewPrompt");
    sendMessage(
      JSON.stringify({
        action: "sendPrompt",
        include_tags: [],
        ignore_tags: ["Ignore"],
      })
    );
  };

  const sendChangePrompt = () => {
    sendMessage(
      JSON.stringify({
        action: "changePrompt",
      })
    );
  };

  useEffect(() => {
    //add logic to log a prompt whenever it is changed
  }, [logPrompt]);

  const handleWebSocketMessage = useCallback((event) => {
    try {
      if (event.data !== "") {
        const response = JSON.parse(event.data);
        switch (response.action) {
          case "newPrompt":
            const newPrompt = JSON.parse(response.prompt.body);
            if (!nextPrompt) {
              console.log("prompt 1 arrives");
              setNextPrompt(newPrompt);
              getNewPrompt();
            } else if (!prompt) {
              setPrompt(newPrompt);
            }
            if (newPrompt.Tags.includes("End-Only")) {
              endSong();
            }
            break;

          case "changePrompt":
            if (nextPrompt) {
              const outgoingPrompt = prompt;
              const endTime = Date().toISOString();
              setLogPrompt({
                performanceCode,
                outgoingPrompt,
                startTime: startTime,
                endTime: endTime,
                ignore: ignore,
              });
              setPrompt(nextPrompt);
              setStartTime(Date().toISOString());
              getNewPrompt();
            } else {
              getNewPrompt();
              setPrompt(null);
            }
            break;

          default:
            console.log("Unknown action: ", response.action);
        }
      }
    } catch (e) {
      setPrompt("Error: " + e);
    }
  }, []);

  const { ws, sendMessage } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_API,
    handleWebSocketMessage
  );

  useEffect(() => {
    if (performanceCode) {
      getNewPrompt();
      console.log("PerformanceCode");
    }
  }, [performanceCode]);

  const handleNextPrompt = () => {
    getNewPrompt();
    sendChangePrompt();
  };

  const handleIgnorePrompt = () => {
    setIgnore(true);
    handleNextPrompt();
  };

  const handleEndSong = () => {
    sendMessage(
      JSON.stringify({
        action: "sendPrompt",
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
