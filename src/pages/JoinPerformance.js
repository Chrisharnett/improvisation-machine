import { Container, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinPerformance = () => {
  const [joinCode, setJoinCode] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/performerPage");
  };
  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="" htmlFor="joinCode">
              Performance Code: {""}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="#$@AGHFD234"
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button type="submit" className="mx-3">
            Submit
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default JoinPerformance;
