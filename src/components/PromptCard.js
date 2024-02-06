import { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const PromptCard = ({
  promptTitle,
  sendMessage,
  prompt,
  gameState,
  handleNextPrompt,
  handleIgnorePrompt,
  disableButtons,
}) => {
  const [startTime, setStartTime] = useState(null);
  const [error, setError] = useState(null);
  const [logPrompt, setLogPrompt] = useState(null);
  const [isFetchingNextPrompt, setIsFetchingNextPrompt] = useState(false);

  // const handleNextHarmonyPrompt = () => {};

  const handleUsePrompt = () => {
    sendMessage(
      JSON.stringify({
        action: "sendPrompt",
        gameState: gameState,
        include_tags: [],
        ignore_tags: ["Ignore", "Start Only", "End Only"],
      })
    );
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
      {/* <Container className="d-flex flex-column align-items-center"> */}
      <Card
        className="m-2 p-2"
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
            <Card.Body className="fs-1">{prompt.Prompt}</Card.Body>
            <Card.Footer>
              <Row>
                {/* {promptTitle === "Harmony Prompt" && (
                  <Button
                    type="submit"
                    className="mx-2"
                    onClick={handleNextHarmonyPrompt}
                    disabled={!prompt}
                    variant="success"
                  >
                    Next
                  </Button>
                )}
                {promptTitle === "Current Prompt" && (
                  <Button
                    type="submit"
                    className="mx-2"
                    onClick={handleNextPrompt}
                    disabled={!prompt}
                    variant="success"
                  >
                    Next
                  </Button>
                )} */}
                {promptTitle === "On Deck" && (
                  <>
                    <Row>
                      <Col>
                        <Button
                          type="submit"
                          variant="success"
                          className="mx-2"
                          onClick={handleNextPrompt}
                          disabled={disableButtons}
                          style={{ width: "100%" }}
                        >
                          Use
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          type="submit"
                          variant="danger"
                          className="mx-2"
                          onClick={handleIgnorePrompt}
                          disabled={disableButtons}
                          style={{ width: "100%" }}
                        >
                          Ignore
                        </Button>
                      </Col>
                    </Row>
                  </>
                )}
              </Row>
            </Card.Footer>
          </>
        )}
        {/* </Card.Body> */}
      </Card>
      {/* </Container> */}
    </>
  );
};

export default PromptCard;
