import PromptCard from "../components/PromptCard.js";
import { useEffect, useState, useCallback, useRef } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useWebSocket } from "../util/WebSocketContext.js";
import { useLocation, useNavigate } from "react-router-dom";
import { JoinExistingPerformanceModal } from "../modals/JoinExistingPerformanceModal.js";
import { CreatePerformanceModal } from "../modals/CreatePerformanceModal.js";
import { TopSpacer } from "../util/TopSpacer.js";
import { PerformanceCodeRejectionModal } from "../modals/PerformanceCodeRejectionModal.js";
import useUser from "../auth/useUser.js";
import { generatePerformanceToken } from "../auth/unauthenticatedToken.js";

const PerformPage = ({
  screenName,
  setScreenName,
  performanceId,
  setPerformanceId,
  loggedIn,
}) => {
  const location = useLocation();
  const user = useUser();
  const navigate = useNavigate();

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [
    showPerformanceCodeRejectionModal,
    setShowPerformanceCodeRejectionModal,
  ] = useState(false);
  const [gameState, setGameState] = useState(location.state?.gameState || null);
  const [isLoading, setIsLoading] = useState(true);
  const [prompt, setPrompt] = useState(null);
  const [disableButtons, setDisableButtons] = useState(false);
  const [, setToken] = useState(null);

  const screenNameRef = useRef(screenName);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    console.log("PerformPage mounted or updated");
    return () => {
      console.log("PerformPage unmounted");
    };
  }, []);

  useEffect(() => {
    screenNameRef.current = screenName;
    if (gameState) {
      userPrompt(gameState.performers);
    }
  }, [screenName, gameState]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const userPrompt = useCallback((performers) => {
    for (let i in performers) {
      if (performers[i].screenName === screenNameRef.current) {
        setPrompt(performers[i].prompt);
        break;
      }
    }
  }, []);

  const { sendMessage, onMessage, reconnect, close, isConnected } =
    useWebSocket();

  const handleWebSocketMessage = useCallback(
    (event) => {
      try {
        console.log("Received WebSocket message:", event.data);
        if (event.data) {
          const response = JSON.parse(event.data);
          if (response.action === "incomingGameChange") {
            setDisableButtons(true);
            return;
          }
          if (response.gameState) {
            setGameState(response.gameState);
            setPerformanceId(response.gameState.performance_id);
            const { performers } = response.gameState;
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
    },
    [userPrompt, setPerformanceId, prompt]
  );

  useEffect(() => {
    if (onMessage) {
      console.log("Setting onMessage handler");
      onMessage(handleWebSocketMessage);
    }
  }, [onMessage, handleWebSocketMessage]);

  const handleNextPrompt = useCallback(() => {
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
  }, [sendMessage]);

  const handleIgnorePrompt = useCallback(() => {
    sendMessage(
      JSON.stringify({
        action: "upcomingGameState",
      })
    );
    const game = { ...gameStateRef.current, nextPrompt: null };
    sendMessage(
      JSON.stringify({
        action: "sendPrompt",
        gameState: game,
        include_tags: [],
        ignore_tags: ["Ignore", "Start Only", "End Only"],
      })
    );
  }, [sendMessage]);

  useEffect(() => {
    if (!gameState && !loggedIn) {
      setShowJoinModal(true);
      setShowCreateModal(false);
      setToken(generatePerformanceToken());
    } else if (!gameState && loggedIn) {
      setShowCreateModal(true);
      setShowJoinModal(false);
    }
  }, [gameState, loggedIn]);

  // Reconnect logic
  useEffect(() => {
    const handleReconnect = () => {
      console.log("Reconnecting WebSocket...");
      reconnect();
    };

    const handleUnload = () => {
      console.log("Closing WebSocket...");
      close();
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("online", handleReconnect);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("online", handleReconnect);
    };
  }, [reconnect, close]);

  // Keep-alive messages
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        sendMessage(JSON.stringify({ action: "keepAlive" }));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [sendMessage, isConnected]);

  return (
    <>
      <TopSpacer />
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass">
          <h1> Performance</h1>
          <h2> {screenName}</h2>
          {isConnected ? (
            <>
              <p>Connected</p>
              <p> Performance Code: {performanceId}</p>
            </>
          ) : (
            <p>Not Connected</p>
          )}

          <>
            <Row>
              {gameState?.harmonyPrompt && (
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
              {gameState?.nextPrompt && (
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
            onClick={handleNextPrompt}
            disabled={!prompt}
          >
            Next Prompt
          </Button>

          <Row className="mt-3">
            {gameState && (
              <>
                <h2>Performers</h2>
                {gameState.performers.map((performer, index) => (
                  <Col key={performer.screenName + index} sm="auto">
                    <p key={index}>{performer.screenName}</p>
                  </Col>
                ))}
              </>
            )}
          </Row>
        </Container>
      </Container>
      <JoinExistingPerformanceModal
        show={showJoinModal}
        setShow={setShowJoinModal}
        screenName={screenName}
        setScreenName={setScreenName}
        performanceId={performanceId}
        setPerformanceId={setPerformanceId}
        sendMessage={sendMessage}
      />
      <CreatePerformanceModal
        show={showCreateModal}
        setShow={setShowCreateModal}
        screenName={screenName}
        setScreenName={setScreenName}
        user={user}
        setShowJoinModal={setShowJoinModal}
        sendMessage={sendMessage}
      />
      <PerformanceCodeRejectionModal
        show={showPerformanceCodeRejectionModal}
        setShow={setShowPerformanceCodeRejectionModal}
      />
    </>
  );
};

export default PerformPage;
