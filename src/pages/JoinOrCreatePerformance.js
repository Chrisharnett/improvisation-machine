import { useEffect, useState, useCallback, useRef } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import useWebSocket from "../hooks/useWebSocket.js";
import useUser from "../auth/useUser";
import { useNavigate } from "react-router-dom";
import { JoinExistingPerformanceModal } from "../modals/JoinExistingPerformanceModal";

const JoinOrCreatePerformance = (userData) => {
  const [screenName, setScreenName] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [prompt, setPrompt] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const navigate = useNavigate();

  const screenNameRef = useRef(screenName);

  const user = useUser();

  useEffect(() => {
    screenNameRef.current = screenName;
  }, [screenName]);

  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const handleWebSocketMessage = useCallback((event) => {
    try {
      if (event.data !== "") {
        const response = JSON.parse(event.data);
        if (response.action === "Performance created") {
          navigate("/performPage", {
            state: {
              gameState: response.gameState,
              screenName: screenNameRef.current,
            },
          });
        } else {
          console.log("Unknown action: ", response.action);
        }
      }
    } catch (e) {
      console.log("Error: " + e);
    }
  }, []);

  const { ws, sendMessage } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_API,
    handleWebSocketMessage
  );

  const handleCreatePerformance = () => {
    sendMessage(
      JSON.stringify({
        action: "createPerformance",
        sub: user.sub,
        screenName: screenName,
      })
    );
    setRegistered(true);
  };

  const handleJoinExistingPerformance = () => {
    setShowJoinModal(true);
  };

  return (
    <>
      <div style={{ height: "6vh" }}></div>
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass">
          <h1> Performance</h1>
          <>
            <Form>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  className="mb-3"
                  type="text"
                  placeholder="What should I call you?"
                  onChange={(e) => setScreenName(e.target.value)}
                  style={{ width: "30vw" }}
                />
              </Form.Group>
            </Form>
            <Row>
              <Col>
                <Button
                  onClick={handleCreatePerformance}
                  disabled={!screenName}
                >
                  Create Performance
                </Button>
              </Col>
              <Col>
                <Button
                  onClick={handleJoinExistingPerformance}
                  disabled={!screenName}
                >
                  Join Performance
                </Button>
              </Col>
            </Row>
          </>
        </Container>
      </Container>
      <JoinExistingPerformanceModal
        show={showJoinModal}
        setShow={setShowJoinModal}
      />
    </>
  );
};

export default JoinOrCreatePerformance;
