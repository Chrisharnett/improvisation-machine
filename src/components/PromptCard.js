import { useState, useEffect, useCallback, useRef } from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const PromptCard = ({ promptTitle, sendMessage, prompt, gameState }) => {
  const [ignore, setIgnore] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null);
  const [logPrompt, setLogPrompt] = useState(null);
  const [isFetchingNextPrompt, setIsFetchingNextPrompt] = useState(false);

  const fetchNextPrompt = useCallback(() => {
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
        action: "sendPrompt",
        gameState: gameState,
        include_tags: [],
        ignore_tags: ["Ignore", "Start Only", "End Only"],
      })
    );
  };

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
          {prompt && (
            <>
              <Card.Title className="p-2">{promptTitle}</Card.Title>
              <Card.Body className="fs-1">{prompt}</Card.Body>
              <Card.Footer>
                <Row>
                  {promptTitle !== "On Deck" && (
                    <Button
                      type="submit"
                      className="mx-2"
                      onClick={handleNextPrompt}
                      disabled={!prompt}
                      variant="success"
                    >
                      Next
                    </Button>
                  )}
                  {promptTitle === "On Deck" && (
                    <Button
                      type="submit"
                      variant="danger"
                      className="mx-2"
                      onClick={handleIgnorePrompt}
                      disabled={!prompt}
                    >
                      Ignore
                    </Button>
                  )}
                </Row>
              </Card.Footer>
            </>
          )}
          {/* </Card.Body> */}
        </Card>
      </Container>
    </>
  );
};

export default PromptCard;
