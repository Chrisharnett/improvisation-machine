import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { PerformanceCodeRejectionModal } from "./PerformanceCodeRejectionModal.js";

export const JoinExistingPerformanceModal = ({
  show,
  setShow,
  screenName,
  setScreenName,
  roomName,
  setRoomName,
  sendMessage,
  userId,
  setUserId,
  instrument,
  setInstrument,
  setShowLobbyModal,
}) => {
  const [
    showPerformanceCodeRejectionModal,
    setShowPerformanceCodeRejectionModal,
  ] = useState(false);
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const navigate = useNavigate();

  const generateUserId = () => {
    return uuidv4();
  };

  const handleJoinExistingPerformance = (e) => {
    e.preventDefault();
    let id = userId;
    if (!id) {
      id = generateUserId();
      setUserId(id);
    }
    sendMessage(
      JSON.stringify({
        action: "joinRoom",
        roomName: roomName,
        screenName: screenName,
        userId: id,
        instrument: instrument,
      })
    );
    handleClose();
    setShowLobbyModal(true);
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
              value={roomName || ""}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Form.Label htmlFor="instrument">Instrument</Form.Label>
            <Form.Control
              type="text"
              id="instrument"
              placeholder="Instrument"
              value={instrument || ""}
              onChange={(e) => setInstrument(e.target.value)}
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
