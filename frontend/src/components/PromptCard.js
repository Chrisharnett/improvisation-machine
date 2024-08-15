import { Card, Button, Row, Col } from "react-bootstrap";

const PromptCard = ({
  promptTitle,
  sendMessage,
  prompt,
  gameState,
  disableButtons,
  roomName,
}) => {
  const handleUsePrompt = () => {
    sendMessage(
      JSON.stringify({
        action: "useNextPrompt",
        gameState: gameState,
        roomName: roomName,
      })
    );
  };

  const handleIgnorePrompt = () => {
    sendMessage(
      JSON.stringify({
        action: "ignorePrompt",
        gameState: gameState,
        roomName: roomName,
      })
    );
  };

  return (
    <>
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
            <Card.Title className="p-2 fs-4">{/* {promptTitle} */}</Card.Title>
            <Card.Body className="fs-4">{prompt}</Card.Body>
            <Card.Footer>
              <Row>
                {promptTitle === "nextPrompt" && (
                  <>
                    <Row>
                      <Col>
                        <Button
                          type="submit"
                          variant="success"
                          className="mx-2"
                          onClick={handleUsePrompt}
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
      </Card>
    </>
  );
};

export default PromptCard;
