import { Card, Row } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState } from "react";

const OptionCard = ({ message, onClick }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (message) {
      setShowContent(true);
    }
  }, [message]);

  return (
    <>
      <CSSTransition
        in={showContent}
        timeout={700} // Timeout should match the transition duration in CSS
        classNames="fade"
        unmountOnExit
      >
        <Card
          className="m-2 p-2"
          onClick={() => onClick(message)}
          style={{
            backdropFilter: "blur(10px) saturate(50%)",
            WebkitBackdropFilter: "blur(21px) saturate(50%)",
            backgroundColor: "rgba(1, 1, 1, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.01)",
            borderRadius: "15px",
            color: "rgb(255, 255, 255, 1)",
          }}
        >
          <>
            <Card.Title className="p-2 fs-4"></Card.Title>
            <Card.Body className="fs-4">{message}</Card.Body>
            <Card.Footer>
              <Row></Row>
            </Card.Footer>
          </>
        </Card>
      </CSSTransition>
    </>
  );
};

export default OptionCard;
