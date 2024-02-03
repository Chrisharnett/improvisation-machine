import PromptCard from "../components/PromptCard";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import useWebSocket from "../hooks/useWebSocket.js";

const PerformPage = () => {
  const [performance_id, setPerformance_id] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Click Begin Song to start");
  const [songEnd, setSongEnd] = useState(false);
  const [screenName, setScreenName] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [prompt, setPrompt] = useState(null);
  const [nextPrompt, setNextPrompt] = useState(null);

  const screenNameRef = useRef(screenName);

  useEffect(() => {
    screenNameRef.current = screenName;
  }, [screenName]);

  const handleWebSocketMessage = useCallback(
    (event) => {
      try {
        if (event.data !== "") {
          const response = JSON.parse(event.data);
          if (response.gameState) {
            setGameState(response.gameState);
            setPerformance_id(response.gameState.performance_id);
            const { performers, nextPrompt } = response.gameState;
            for (let i in performers) {
              if (performers[i].screenName === screenNameRef.current) {
                setPrompt(performers[i].prompt);
              }
            }
            if (!prompt) {
              setPrompt(performers[0].prompt);
            }
            if (nextPrompt) {
              setNextPrompt(nextPrompt);
            }
          } else {
            console.log("Unknown action: ", response.action);
          }
        }
      } catch (e) {
        console.log("Error: " + e);
      }
    },
    [screenNameRef.current]
  );

  const newPrompt = () => {};

  const { ws, sendMessage } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_API,
    handleWebSocketMessage
  );

  useEffect(() => {
    if (gameState) {
      const isPromptMissing = gameState.performers.some(
        (performer) => performer.prompt === "" || performer.prompt === null
      );
      if (isPromptMissing) {
        sendMessage(
          JSON.stringify({
            action: "sendPrompt",
            gameState: gameState,
            include_tags: [],
            ignore_tags: ["Ignore"],
          })
        );
      }
    }
  }, [gameState]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleStartPerformance = () => {
    // const id = uuidv4();
    const id = "test1234";
    setPerformance_id(id);
    setMessage("This takes a moment.");
    sendMessage(
      JSON.stringify({
        action: "startPerformance",
        performance_id: id,
        screenName: screenName,
      })
    );
    setRegistered(true);
  };

  const handleJoinPerformance = () => {
    setRegistered(true);
    sendMessage(
      JSON.stringify({
        action: "joinPerformance",
        performance_id: performance_id,
        newPerformer: { screenName, prompt },
      })
    );
  };

  const handleNextPerformance = () => {};

  return (
    <>
      <div style={{ height: "6vh" }}></div>
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass">
          <h1> Performance</h1>
          {registered && (
            <PromptCard
              className="glass"
              isLoading={isLoading}
              message={message}
              sendMessage={sendMessage}
              prompt={prompt}
              setPrompt={setPrompt}
              nextPrompt={nextPrompt}
              setNextPrompt={setNextPrompt}
              gameState={gameState}
            />
          )}

          <Row>
            {gameState && (
              <>
                <h2>Performers</h2>
                {gameState.performers.map((performer, index) => (
                  <Col key={performer.screenName + index} sm="auto">
                    <p key={index}>{performer.screenName} </p>
                  </Col>
                ))}
              </>
            )}
          </Row>

          {!gameState && !registered && (
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
              <Button onClick={handleStartPerformance} disabled={!screenName}>
                Start Performance
              </Button>
            </>
          )}

          {gameState && !registered && (
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
              <Button
                variat="success"
                onClick={handleJoinPerformance}
                disabled={!screenName}
              >
                Join Performance
              </Button>
            </>
          )}
          {registered && (
            <Button onClick={handleNextPerformance} disabled={performance_id}>
              Next Song
            </Button>
          )}
        </Container>
      </Container>
    </>
  );
};

export default PerformPage;
