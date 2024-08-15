import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

const LobbyFeedbackChat = ({
  sendMessage,
  feedbackQuestion,
  roomName,
  userId,
}) => {
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!response.trim()) {
      setError("Response cannot be empty.");
    } else {
      sendMessage(
        JSON.stringify({
          action: "performerLobbyFeedbackResponse",
          roomName: roomName,
          feedbackQuestion: feedbackQuestion,
          userId: userId,
          response: response,
        })
      );
      setResponse("");
      setError("");
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col>
          <Form onSubmit={handleSendMessage}>
            <Form.Group controlId="formFeedbackInput">
              <Form.Label className="text-center w-100">
                Rate which prompt do you prefer.
              </Form.Label>
              <Row className="text-center mb-3">
                <Col>
                  <strong>Prompt 1:</strong> {feedbackQuestion[0]}
                </Col>
                <Col>
                  <strong>Prompt 2:</strong> {feedbackQuestion[1]}
                </Col>
              </Row>
              <Form.Control
                type="text"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Your response"
              />
              {error && (
                <Form.Control.Feedback
                  type="invalid"
                  style={{ display: "block" }}
                >
                  {error}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LobbyFeedbackChat;
