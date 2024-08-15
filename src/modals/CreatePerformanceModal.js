import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import useUser from "../auth/useUser";

export const CreatePerformanceModal = ({
  show,
  setShow,
  screenName,
  setScreenName,
  setShowJoinModal,
  setShowLobbyModal,
  sendMessage,
  userId,
  instrument,
  setInstrument,
  setRoomCreator,
}) => {
  const handleClose = () => {
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
  };

  const navigate = useNavigate();

  const handleCreatePerformance = (e) => {
    e.preventDefault();
    sendMessage(
      JSON.stringify({
        action: "createRoom",
        userId: userId,
        screenName: screenName,
        instrument: instrument,
      })
    );
    setRoomCreator(true);
    handleClose();
    setShowLobbyModal(true);
  };

  const handleJoinPerformance = () => {
    console.log("Joining performance");
    setShowJoinModal(true);
    handleClose();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="blue-text">Start a Performance</Modal.Title>
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
          <Button onClick={handleJoinPerformance}> Join Performance </Button>
          <Button variant="success" onClick={handleCreatePerformance}>
            Create Performance
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
