import { useState, useEffect } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const NewPromptCard = ({ prompt }) => {
  const [error, setError] = useState(null);

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
        {prompt && (
          <>
            <Card.Title className="p-2 fs-4">{prompt}</Card.Title>
            <Card.Body className="fs-4">{""}</Card.Body>
            <Card.Footer></Card.Footer>
          </>
        )}
      </Card>
    </>
  );
};

export default NewPromptCard;
