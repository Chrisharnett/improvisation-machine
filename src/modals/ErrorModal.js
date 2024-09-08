import { useEffect } from "react";
import { Modal } from "react-bootstrap";

export const ErrorModal = ({ show, setShow, message, setMessage }) => {
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        handleClose();
        setMessage("");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [handleClose, setMessage, show]);

  const [title, error] = (message && Object.entries(message)[0]) || ["", ""];

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="blue-text">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="blue-text">{error}</Modal.Body>
      </Modal>
    </>
  );
};
