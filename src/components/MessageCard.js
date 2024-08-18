import { Card, Form, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

const MessageCard = ({ message, response, setResponse, handleSubmit }) => {
  const handleClickSubmit = (userResponse) => {
    handleSubmit(userResponse);
    setResponse("");
  };

  return (
    <>
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
          <Card.Body className="fs-4">{message.message}</Card.Body>
          <Card.Footer>
            {message.responseRequired && (
              <>
                <Form.Control
                  type="text"
                  placeholder="Enter your response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  className="mt-2"
                />
                <Button
                  variant="primary"
                  onClick={() => handleClickSubmit(response)}
                  className="mt-2"
                >
                  Submit
                </Button>
              </>
            )}
          </Card.Footer>
        </>
      </Card>
    </>
  );
};

export default MessageCard;
