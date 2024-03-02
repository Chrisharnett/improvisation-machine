import PromptCard from "../components/PromptCard";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import useWebSocket from "../hooks/useWebSocket.js";
import { useLocation, useNavigate } from "react-router-dom";

const PerformPage = () => {
  const location = useLocation();

  const [gameState, setGameState] = useState(location.state?.gameState);
  const [performance_id, setPerformance_id] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [songEnd, setSongEnd] = useState(false);
  const [screenName, setScreenName] = useState(location.state?.screenName);
  const [registered, setRegistered] = useState(false);
  const [prompt, setPrompt] = useState(null);
  const [nextPrompt, setNextPrompt] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [ignore, setIgnore] = useState(false);
  const [performers, setPerformers] = useState([]);

  const screenNameRef = useRef(screenName);

  const navigate = useNavigate();

  useEffect(() => {
    screenNameRef.current = screenName;
    userPrompt([{ screenName: screenNameRef.current }]);
  }, [screenName]);

  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const userPrompt = (performers) => {
    for (let i in performers) {
      if (performers[i].screenName === screenNameRef.current) {
        setPrompt(gameState.performers[i].prompt);
      }
    }
  };

  const handleWebSocketMessage = useCallback((event) => {
    try {
      if (event.data !== "") {
        const response = JSON.parse(event.data);
        if (response.action === "incomingGameChange") {
          setDisableButtons(true);
          return;
        }
        if (response.gameState) {
          setGameState(response.gameState);
          setPerformance_id(response.gameState.performance_id);
          const { performers } = response.gameState;
          setPerformers(performers);
          userPrompt(performers);
          if (!prompt) {
            setPrompt(performers[0].prompt);
          }
          setDisableButtons(false);
        } else {
          console.log("Unknown action: ", response.action);
        }
      }
    } catch (e) {
      console.log("Error: " + e);
    }
  }, []);

  // useEffect(() => {
  //   const nextPromptTimer = setInterval(() => {
  //     if (gameStateRef.current) {
  //       gameStateRef.current.nextPrompt = null;
  //       getNewPrompt();
  //     }
  //   }, 20000);
  //   return () => clearInterval(nextPromptTimer);
  // }, []);

  // const getNewPrompt = () => {
  //   sendMessage(
  //     JSON.stringify({
  //       action: "sendPrompt",
  //       gameState: gameStateRef.current,
  //       include_tags: [],
  //       ignore_tags: ["Ignore", "Start Only", "End Only"],
  //     })
  //   );
  // };

  const handleNextPrompt = () => {
    sendMessage(
      JSON.stringify({
        action: "upcomingGameState",
      })
    );
    sendMessage(
      JSON.stringify({
        action: "sendPrompt",
        gameState: gameStateRef.current,
        include_tags: [],
        ignore_tags: ["Ignore", "Start Only", "End Only"],
      })
    );
  };

  const handleIgnorePrompt = () => {
    sendMessage(
      JSON.stringify({
        action: "upcomingGameState",
      })
    );
    setIgnore(true);
    const game = { ...gameStateRef.current };
    game.nextPrompt = null;
    sendMessage(
      JSON.stringify({
        action: "sendPrompt",
        gameState: game,
        include_tags: [],
        ignore_tags: ["Ignore", "Start Only", "End Only"],
      })
    );
  };

  const { ws, sendMessage } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_API,
    handleWebSocketMessage
  );

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  // }, []);

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

  const handleEndSong = () => {};

  const handleNextPerformance = () => {};

  const handleJoinExistingPerformance = () => {};

  if (!gameState) {
    navigate("/joinOrCreatePerformance");
  } else {
    return (
      <>
        <div style={{ height: "6vh" }}></div>
        <Container className="fullVHeight d-flex justify-content-center align-items-center">
          <Container className="midLayer glass">
            <h1> Performance</h1>
            <h2> {screenName}</h2>
            <p> Performance Code: {gameState.performance_id}</p>
            <>
              <Row>
                {gameState.harmonyPrompt && (
                  <Col>
                    <PromptCard
                      className="glass"
                      promptTitle="Harmony Prompt"
                      sendMessage={sendMessage}
                      prompt={gameState.harmonyPrompt}
                      gameState={gameState}
                      handleNextPrompt={handleNextPrompt}
                      disableButtons={disableButtons}
                      handleIgnorePrompt={handleIgnorePrompt}
                    />
                  </Col>
                )}

                {prompt && (
                  <Col>
                    {/* Current Prompt */}
                    <PromptCard
                      className="glass"
                      promptTitle="Current Prompt"
                      sendMessage={sendMessage}
                      prompt={prompt}
                      gameState={gameState}
                      handleNextPrompt={handleNextPrompt}
                      disableButtons={disableButtons}
                      handleIgnorePrompt={handleIgnorePrompt}
                    />
                  </Col>
                )}
                {gameState.nextPrompt && (
                  <Col>
                    <PromptCard
                      className="glass"
                      promptTitle="On Deck"
                      isLoading={isLoading}
                      sendMessage={sendMessage}
                      prompt={gameState.nextPrompt}
                      gameState={gameState}
                      handleNextPrompt={handleNextPrompt}
                      disableButtons={disableButtons}
                      handleIgnorePrompt={handleIgnorePrompt}
                    />
                  </Col>
                )}
              </Row>
            </>
            <hr></hr>

            <Button
              type="submit"
              className="m-2"
              onClick={handleEndSong}
              disabled={!prompt}
            >
              End Song
            </Button>

            {registered && !performance_id && (
              <Button
                className="m-2"
                onClick={handleNextPerformance}
                disabled={performance_id}
              >
                Next Song
              </Button>
            )}
            <Row className="mt-3">
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
          </Container>
        </Container>
      </>
    );
  }
};

export default PerformPage;
