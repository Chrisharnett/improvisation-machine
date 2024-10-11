import { Card, Form, Button } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";
import { useEffect, useState } from "react";
import ResponseBox from "./ResponseBox";

const MessageCard = ({
  message,
  response,
  responseRequired,
  setResponse,
  handleSubmit,
}) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (message) {
      setShowContent(true);
    }
  }, [message]);

  const handleClickSubmit = (userResponse) => {
    handleSubmit(userResponse);
    setResponse("");
  };

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
              {responseRequired && (
                <ResponseBox handleSubmit={handleClickSubmit} />
                // <>
                //   <Form.Control
                //     type="text"
                //     placeholder="Enter your response"
                //     value={response}
                //     onChange={(e) => setResponse(e.target.value)}
                //     className="mt-2"
                //   />
                //   <Button
                //     variant="primary"
                //     onClick={() => handleClickSubmit(response)}
                //     className="mt-2"
                //   >
                //     Submit
                //   </Button>
                // </>
              )}
            </Card.Footer>
          </>
        </Card>
      </CSSTransition>
    </>
  );
};

export default MessageCard;
