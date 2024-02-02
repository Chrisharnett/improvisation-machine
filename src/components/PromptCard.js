import { useState, useEffect, useCallback, useRef } from "react";
import { Card, Button, Container } from "react-bootstrap";

const PromptCard = ({
  isLoading,
  message,
  sendMessage,
  prompt,
  setPrompt,
  nextPrompt,
  setNextPrompt,
}) => {
  // const [prompt, setPrompt] = useState(null);
  const [ignore, setIgnore] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null);
  const [logPrompt, setLogPrompt] = useState(null);
  // const [nextPrompt, setNextPrompt] = useState(null);
  const [isFetchingNextPrompt, setIsFetchingNextPrompt] = useState(false);
  const [firstPrompt, setFirstPrompt] = useState(true);

  const currentPromptRef = useRef(null);
  const nextPromptRef = useRef(null);

  // const endSong = () => {
  //   setSongEnd(true);
  //   setPerformanceCode(null);
  //   //log Performance - probably a modal
  //   // Maybe move logging functionality outside, or here.
  //   // setPerformanceCode(null);
  // };

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
      <Container className="d-flex flex-column align-items-center">
        <Card
          style={{
            backdropFilter: "blur(10px) saturate(50%)",
            WebkitBackdropFilter: "blur(21px) saturate(50%)",
            backgroundColor: "rgba(1, 1, 1, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.01)",
            borderRadius: "15px",
            color: "rgb(255, 255, 255, 1)",
          }}
        >
          <Card.Body className="align-items-center">
            {prompt && (
              <Card.Title className="fs-1">{prompt.Prompt}</Card.Title>
            )}
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
      </Container>
    </>
  );
};

export default PromptCard;
