import PromptCard from "../components/PromptCard";
import { useEffect, useState, useCallback } from "react";
import { Button, Container, Form, Row, Col } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import useWebSocket from "../hooks/useWebSocket.js";

const PerformPage = () => {
  const [performanceId, setPerformanceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Click Begin Song to start");
  const [songEnd, setSongEnd] = useState(false);
  const [screenName, setScreenName] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [disableStartButton, setDisableStartButton] = useState(true);
  const [registered, setRegistered] = useState(false);
  const [prompt, setPrompt] = useState(null);
  const [nextPrompt, setNextPrompt] = useState(null);
  const [performers, setPerformers] = useState(null);

  const handleWebSocketMessage = useCallback((event) => {
    try {
      if (event.data !== "") {
        const response = JSON.parse(event.data);
        if (response.gameState) {
          setGameState(response.gameState);
          const { performanceId, performers, nextPrompt } = response.gameState;
          for (let performer in performers) {
            if (performer.screenName === screenName) {
              setPrompt(performer.prompt);
            }
          }
          setPerformanceId(performanceId);
          setPerformers(performers);
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
  }, []);

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
            include_tags: ["Start", "Start Only"],
            ignore_tags: ["Ignore"],
          })
        );
      }
    }
  }, [gameState]);

  // useEffect(() => {
  //   if (gameState) {
  //     const { screenName, performers, prompts } = gameState;
  //     setScreenName(hostScreenName);
  //     setPerformers(performers);
  //     setPrompt(prompts.currentPrompt);
  //     setNextPrompt(prompts.NextPrompt);
  //   }
  // }, [gameState]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  // useEffect(() => {
  //   if (gameState) {
  //   }
  // }, [gameState]);

  const handleStartPerformance = () => {
    // const id = uuidv4();
    const id = "test1234";
    setPerformanceId(id);
    setMessage("This takes a moment.");
    sendMessage(
      JSON.stringify({
        action: "startPerformance",
        performanceId: id,
        screenName: screenName,
      })
    );
    setRegistered(true);
  };

  const handleJoinPerformance = () => {
    sendMessage(
      JSON.stringify({
        action: "joinPerformance",
        performanceId: performanceId,
        screenName: screenName,
      })
    );
    setRegistered(true);
  };

  const handleNextPerformance = () => {};

  return (
    <>
      <div style={{ height: "6vh" }}></div>
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass">
          <h1> Performance</h1>
          <PromptCard
            className="glass"
            isLoading={isLoading}
            message={message}
            sendMessage={sendMessage}
            prompt={prompt}
            setPrompt={setPrompt}
            nextPrompt={nextPrompt}
            setNextPrompt={setNextPrompt}
          />
          <Row>
            {performers && (
              <>
                <h2>Performers</h2>
                {performers.map((performer, index) => (
                  <Col sm="auto">
                    <p key={index}>{performer.screenName}, </p>
                  </Col>
                ))}
              </>
            )}
          </Row>

          {!gameState && (
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
            <Button onClick={handleNextPerformance} disabled={performanceId}>
              Next Song
            </Button>
          )}
        </Container>
      </Container>
    </>
  );
};

export default PerformPage;
