import { Modal, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const CreatePerformanceModal = ({
  show,
  setShow,
  screenName,
  setScreenName,
  user,
  handleWebSocketMessage,
  setShowJoinModal,
  sendMessage,
}) => {
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const navigate = useNavigate();

  const handleCreatePerformance = () => {
    sendMessage(
      JSON.stringify({
        action: "createPerformance",
        sub: user.sub,
        screenName: screenName,
      })
    );
    handleClose();
  };

  const handleJoinPerformance = () => {
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
