import { useState, useEffect, useCallback, useRef } from "react";
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
  const [isFetchingNextPrompt, setIsFetchingNextPrompt] = useState(false);

  const currentPromptRef = useRef(null);
  const nextPromptRef = useRef(null);

  // const endSong = () => {
  //   setSongEnd(true);
  //   setPerformanceCode(null);
  //   //log Performance - probably a modal
  //   // Maybe move logging functionality outside, or here.
  //   // setPerformanceCode(null);
  // };

  const handleWebSocketMessage = useCallback((event) => {
    try {
      if (event.data !== "") {
        setIsFetchingNextPrompt(false);
        const response = JSON.parse(event.data);
        switch (response.action) {
          case "newPrompt":
            const newPrompt = JSON.parse(response.prompt.body);
            if (!currentPromptRef.current) {
              currentPromptRef.current = newPrompt;
              setPrompt(newPrompt);
            } else {
              nextPromptRef.current = newPrompt;
              setNextPrompt(newPrompt);
            }
            if (newPrompt.Tags.includes("End-Only")) {
              // endSong();
            }
            break;

          case "changePrompt":
            if (nextPromptRef.current) {
              const outgoingPrompt = currentPromptRef.current;
              setPrompt(nextPromptRef.current);
              currentPromptRef.current = nextPromptRef.current;
              nextPromptRef.current = null;
              setNextPrompt(null);
              // const endTime = new Date().toISOString();
              // setLogPrompt({
              //   performanceCode,
              //   outgoingPrompt,
              //   startTime: startTime,
              //   endTime: endTime,
              //   ignore: ignore,
              // });
              setStartTime(new Date().toISOString());
              fetchNextPrompt();
            } else {
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

  const fetchNextPrompt = useCallback(() => {
    console.log("fetch prompt: ", isFetchingNextPrompt);
    if (!isFetchingNextPrompt) {
      setIsFetchingNextPrompt(true);
      sendMessage(
        JSON.stringify({
          action: "sendPrompt",
          include_tags: [],
          ignore_tags: ["Ignore"],
        })
      );
    }
  }, []);

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

  useEffect(() => {
    if (
      (!nextPromptRef.current || !currentPromptRef.current) &&
      !isFetchingNextPrompt
    ) {
      fetchNextPrompt();
      console.log("fetching next prompt");
    }
  }, [currentPromptRef.current]);

  useEffect(() => {
    if (performanceCode && !currentPromptRef.current) {
      setIsFetchingNextPrompt(true);
      sendMessage(
        JSON.stringify({
          action: "sendPrompt",
          include_tags: [],
          ignore_tags: ["Ignore", "End-Only"],
        })
      );
    }
  }, [performanceCode]);

  const handleNextPrompt = () => {
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
          {nextPrompt && (
            <Card.Text className="">On Deck: {nextPrompt.Prompt}</Card.Text>
          )}
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
