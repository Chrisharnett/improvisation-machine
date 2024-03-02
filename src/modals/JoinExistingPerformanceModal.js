import { useState, useCallback } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useWebSocket from "../hooks/useWebSocket.js";

export const JoinExistingPerformanceModal = ({
  show,
  setShow,
  screenName,
  setScreenName,
}) => {
  const [performanceCode, setPerformanceCode] = useState("");
  const [
    showPerformanceCodeRejectionModal,
    setShowPerformanceCodeRejectionModal,
  ] = useState(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const navigate = useNavigate();

  const handleWebSocketMessage = useCallback((event) => {
    try {
      if (event.data !== "") {
        const response = JSON.parse(event.data);
        if (response.action === "updateGameState") {
          navigate("/performPage", {
            state: { gameState: response.gameState, screenName: screenName },
          });
          handleClose();
        } else if (response.action === "Invalid performance code.") {
          setShowPerformanceCodeRejectionModal(true);
          navigate("/");
        } else {
          console.log("Unknown action: ", response.action);
        }
      }
    } catch (e) {
      console.log("Error: " + e);
    }
  }, []);

  const { ws, sendMessage } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_API,
    handleWebSocketMessage
  );

  const handleJoinExistingPerformance = (e) => {
    e.preventDefault();
    sendMessage(
      JSON.stringify({
        action: "joinExistingPerformanceRoute",
        performance_id: performanceCode,
        screenName: screenName,
      })
    );
  };
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="blue-text">Join a Performance</Modal.Title>
        </Modal.Header>
        <Modal.Body className="blue-text">
          <Form>
            <Form.Label className="" htmlFor="screenName">
              Screen Name
            </Form.Label>
            <Form.Control
              type="text"
              id="screenName"
              placeholder="Enter your screen name"
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)}
            />
            <Form.Label htmlFor="joinCode">Performance Code</Form.Label>
            <Form.Control
              type="text"
              id="screenName"
              placeholder="Performance Code"
              value={performanceCode}
              onChange={(e) => setPerformanceCode(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="" onClick={handleJoinExistingPerformance}>
            Join
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
