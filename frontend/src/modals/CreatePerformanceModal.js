import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import useUser from "../auth/useUser";

export const CreatePerformanceModal = ({
  show,
  setShow,
  screenName,
  setScreenName,
  // user,
  handleWebSocketMessage,
  setShowJoinModal,
  sendMessage,
}) => {
  const handleClose = useCallback(() => {
    setShow(false);
    console.log("Modal closed");
  }, [setShow]);

  const handleOpen = useCallback(() => {
    setShow(true);
    console.log("Modal opened");
  }, [setShow]);

  const user = useUser();

  const navigate = useNavigate();

  const handleCreatePerformance = useCallback(() => {
    console.log("Creating performance with screen name:", screenName);
    sendMessage(
      JSON.stringify({
        action: "createPerformance",
        sub: user.sub,
        screenName: screenName,
      })
    );
    handleClose();
  }, [sendMessage, user.sub, screenName, handleClose]);

  const handleJoinPerformance = useCallback(() => {
    console.log("Joining performance");
    setShowJoinModal(true);
    handleClose();
  }, [setShowJoinModal, handleClose]);

  const handleScreenNameChange = useCallback(
    (e) => {
      // console.log("Screen name changed:", e.target.value);
      setScreenName(e.target.value);
    },
    [setScreenName]
  );

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
              onChange={handleScreenNameChange}
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
