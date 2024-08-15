import { Modal, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import LobbyFeedbackChat from "../components/LobbyFeedbackChat";

export const LobbyModal = ({
  show,
  setShow,
  gameState,
  roomCreator,
  roomName,
  sendMessage,
  feedbackQuestion,
  userId,
}) => {
  const [disableStartButton, setDisableStartButton] = useState(true);

  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const handleStartPerformance = (e) => {
    e.preventDefault();
    sendMessage(
      JSON.stringify({
        action: "startPerformance",
        roomName: roomName,
      })
    );
    handleClose();
  };

  useEffect(() => {
    if (gameState && gameState.performers.length >= 1) {
      setDisableStartButton(false);
    }
  });

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="blue-text">
            Waiting for players to join.
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="blue-text">
          {feedbackQuestion && (
            <>
              <LobbyFeedbackChat
                sendMessage={sendMessage}
                roomName={roomName}
                feedbackQuestion={feedbackQuestion}
                userId={userId}
              />
              <hr></hr>
            </>
          )}
          {gameState ? (
            <>
              <p>Room Name: {roomName}</p>
              <hr></hr>
              <p>Players:</p>
              <Row className="mt-3">
                {gameState.performers.map((performer, index) => (
                  <Col key={index}>{performer.screenName}</Col>
                ))}
              </Row>
            </>
          ) : (
            <>Waiting for room to open.</>
          )}
        </Modal.Body>
        <Modal.Footer>
          {roomCreator && (
            <Button
              variant="success"
              onClick={handleStartPerformance}
              disabled={disableStartButton}
            >
              Start Performance
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
