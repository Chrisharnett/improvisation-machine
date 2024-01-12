import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { useEffect } from "react";

export const CreatePromptSuccessModal = ({ show, setShow, prompt }) => {
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="blue-text">Success!</Modal.Title>
        </Modal.Header>
        <Modal.Body className="blue-text">
          {prompt} stored as new performance prompt.
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};
