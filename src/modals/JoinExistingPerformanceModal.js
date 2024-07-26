import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import useWebSocket from "../hooks/useWebSocket.js";
import { PerformanceCodeRejectionModal } from "./PerformanceCodeRejectionModal.js";

export const JoinExistingPerformanceModal = ({
  show,
  setShow,
  screenName,
  setScreenName,
  performanceId,
  setPerformanceId,
  handleWebSocketMessage,
  sendMessage,
}) => {
  const [
    showPerformanceCodeRejectionModal,
    setShowPerformanceCodeRejectionModal,
  ] = useState(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const navigate = useNavigate();

  const handleJoinExistingPerformance = (e) => {
    e.preventDefault();
    sendMessage(
      JSON.stringify({
        action: "joinExistingPerformanceRoute",
        performance_id: performanceId,
        screenName: screenName,
      })
    );
    handleClose();
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
            <Form.Label htmlFor="performanceId">Performance Code</Form.Label>
            <Form.Control
              type="text"
              id="performanceId"
              placeholder="Performance Code"
              value={performanceId || ""}
              onChange={(e) => setPerformanceId(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="" onClick={handleJoinExistingPerformance}>
            Join
          </Button>
        </Modal.Footer>
      </Modal>
      <PerformanceCodeRejectionModal
        show={showPerformanceCodeRejectionModal}
        setShow={setShowPerformanceCodeRejectionModal}
      />
    </>
  );
};
