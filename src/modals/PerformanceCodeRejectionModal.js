import { useEffect } from "react";
import { Modal } from "react-bootstrap";

export const PerformanceCodeRejectionModal = ({ show, setShow }) => {
  const handleClose = () => setShow(false);
  const handleOpen = () => setShow(true);

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
          <Modal.Title className="blue-text">
            Hmmm... That didn't work, try again
          </Modal.Title>
        </Modal.Header>
      </Modal>
    </>
  );
};
