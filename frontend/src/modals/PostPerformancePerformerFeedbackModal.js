import { Modal, Button, Form, Container } from "react-bootstrap";
import { useState } from "react";

export const PostPerformancePerformerFeedbackModal = ({
  show,
  setShow,
  roomCreator,
  roomName,
  sendMessage,
  feedbackQuestion,
  userId,
}) => {
  const [disableFinishButton, setDisableFinishButton] = useState(true);
  const [response, setResponse] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const handleSendFeedback = (e) => {
    e.preventDefault();

    sendMessage(
      JSON.stringify({
        action: "postPerformancePerformerFeedbackResponse",
        roomName: roomName,
        feedbackQuestion: feedbackQuestion,
        userId: userId,
        response: response,
      })
    );
    setResponse("");
    handleClose();
  };

  const handleFinish = (e) => {
    e.preventDefault();
    sendMessage(
      JSON.stringify({
        action: "postPerformancePerformerFeedbackComplete",
        roomName: roomName,
        userId: userId,
      })
    );
    handleClose();
  };

  const handleResetPerformance = (e) => {
    e.preventDefault();

    handleClose();
  };
  //   useEffect(() => {
  //     if (gameState && gameState.performers.length >= 1) {
  //       setDisableStartButton(false);
  //     }
  //   });

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="blue-text">
            Post Performance Performer Feedback
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="blue-text">
          <Container>
            {feedbackQuestion && (
              <>
                <Form onSubmit={handleSendFeedback}>
                  <Form.Group controlId="formFeedbackInput">
                    <Form.Label className="text-center w-100">
                      {feedbackQuestion.question}
                    </Form.Label>

                    <Form.Control
                      type="text"
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      placeholder="Your response"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-">
                    Respond
                  </Button>
                </Form>
              </>
            )}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {roomCreator ? (
            <Button
              variant="success"
              onClick={handleResetPerformance}
              disabled={disableFinishButton}
            >
              Reset Performance Room
            </Button>
          ) : (
            <Button
              variant="success"
              onClick={handleResetPerformance}
              disabled={disableFinishButton}
            >
              Complete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};
