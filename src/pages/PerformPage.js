import PromptCard from "../components/PromptCard.js";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { TopSpacer } from "../util/TopSpacer.js";
import { useWebSocket } from "../util/WebSocketContext.js";
import { JoinExistingPerformanceModal } from "../modals/JoinExistingPerformanceModal.js";
import { CreatePerformanceModal } from "../modals/CreatePerformanceModal.js";
import { PerformanceCodeRejectionModal } from "../modals/PerformanceCodeRejectionModal.js";
import { LobbyModal } from "../modals/LobbyModal.js";
import { PostPerformancePerformerFeedbackModal } from "../modals/PostPerformancePerformerFeedbackModal.js";
import useUser from "../auth/useUser.js";

const PerformPage = ({ loggedIn }) => {
  const [prompt, setPrompt] = useState(null);
  const [message, setMessage] = useState("");

  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [
    showPerformanceCodeRejectionModal,
    setShowPerformanceCodeRejectionModal,
  ] = useState(false);
  const [showLobbyModal, setShowLobbyModal] = useState(false);
  const [screenName, setScreenName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [gameState, setGameState] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [roomCreator, setRoomCreator] = useState(false);
  const [feedbackQuestion, setFeedbackQuestion] = useState(null);
  const [finalPrompt, setFinalPrompt] = useState(false);
  const [
    showPostPerformancePerformerFeedbackModal,
    setShowPostPerformancePerformerFeedbackModal,
  ] = useState(false);
  const [summary, setSummary] = useState(null);

  const { sendMessage, incomingMessage } = useWebSocket();

  const user = useUser();

  useEffect(() => {
    console.log("PerformPage mounted or updated");
    return () => {
      console.log("PerformPage unmounted");
    };
  }, []);

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      if (message.action === "newGameState") {
        setShowLobbyModal(false);
        setGameState(message.gameState);
        setRoomName(message.roomName);
        for (let i in message.gameState.performers) {
          if (message.gameState.performers[i].userId === userId) {
            setCurrentPlayer(message.gameState.performers[i]);
          }
        }
      } else if (message.action === "newPlayer") {
        setGameState(message.gameState);
        setRoomName(message.roomName);
      } else if (message.action === "roomDoesNotExist") {
        setShowPerformanceCodeRejectionModal(true);
      } else if (message.action === "endSong") {
        setGameState(message.gameState);
        for (let i in message.gameState.performers) {
          if (message.gameState.performers[i].userId === userId) {
            setCurrentPlayer(message.gameState.performers[i]);
          }
        }
        setFinalPrompt(true);
      } else if (message.action === "resetPlayer") {
        resetPlayer();
      } else if (message.action === "finalSummary") {
        setSummary(message.summary);
        resetPlayer();
      }
      if (message.feedbackQuestion) {
        const type = message.feedbackQuestion.feedbackType;
        if (type === "performerLobby") {
          setFeedbackQuestion(message.feedbackQuestion.question);
        }
        if (type === "postPerformancePerformerFeedback") {
          setFeedbackQuestion(message.feedbackQuestion);
          setShowPostPerformancePerformerFeedbackModal(true);
        }
      }
    }
  }, [incomingMessage, userId]);

  useEffect(() => {
    if (!loggedIn) {
      setShowCreateModal(false);
      setShowJoinModal(true);
    } else {
      setShowJoinModal(false);
      setShowCreateModal(true);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (user) {
      setUserId(user.sub);
    }
  }, [user]);

  const handleEndSong = () => {
    sendMessage(
      JSON.stringify({
        action: "endSong",
        roomName: roomName,
      })
    );
  };

  const resetPlayer = () => {
    setShowPostPerformancePerformerFeedbackModal(false);
    setGameState(null);
    setFeedbackQuestion(null);
    setFinalPrompt(false);
    currentPlayer.currentPrompts = [];
  };

  const handleEndPerformance = () => {
    sendMessage(
      JSON.stringify({
        action: "performanceComplete",
        roomName: roomName,
      })
    );
    setFinalPrompt(false);
    // TODO: reset the game and show create modal. May move into post performance feedback modal
    // setGameState(null);
    // setShowCreateModal(true);
  };

  const handleProvideFeedback = () => {};

  return (
    <>
      <TopSpacer />
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass">
          <h1> Performance</h1>
          {currentPlayer && (
            <>
              <h2> {currentPlayer.screenName}</h2>
              <Row className="mt-3">
                {summary && <p>{summary}</p>}
                {finalPrompt ? (
                  <Col>
                    <PromptCard
                      promptTitle={"Final Prompt"}
                      prompt={currentPlayer.currentPrompts[0].prompt}
                      gameState={gameState}
                      sendMessage={sendMessage}
                      roomName={roomName}
                    />
                  </Col>
                ) : (
                  <>
                    {currentPlayer.currentPrompts.map((prompt, index) => (
                      <Col key={index}>
                        <PromptCard
                          key={index}
                          promptTitle={prompt.promptTitle[0]}
                          prompt={prompt.prompt}
                          gameState={gameState}
                          sendMessage={sendMessage}
                          roomName={roomName}
                        />
                      </Col>
                    ))}
                  </>
                )}
              </Row>
            </>
          )}
          <Row className="mt-3">
            {finalPrompt ? (
              roomCreator ? (
                <Button
                  variant="warning"
                  type="button"
                  className="w-100"
                  onClick={handleEndPerformance}
                >
                  Click to log and complete
                </Button>
              ) : (
                <Button
                  variant="warning"
                  type="button"
                  className="w-100"
                  onClick={handleProvideFeedback}
                >
                  Provide Feedback
                </Button>
              )
            ) : (
              <Button
                variant="warning"
                type="button"
                className="w-100"
                onClick={handleEndSong}
              >
                End Song
              </Button>
            )}
            {gameState && (
              <>
                <h2> {roomName} </h2>
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
        roomName={roomName}
        setRoomName={setRoomName}
        sendMessage={sendMessage}
        userId={userId}
        setUserId={setUserId}
        instrument={instrument}
        setInstrument={setInstrument}
        setShowLobbyModal={setShowLobbyModal}
      />
      <CreatePerformanceModal
        show={showCreateModal}
        setShow={setShowCreateModal}
        screenName={screenName}
        setScreenName={setScreenName}
        setShowJoinModal={setShowJoinModal}
        sendMessage={sendMessage}
        userId={userId}
        instrument={instrument}
        setInstrument={setInstrument}
        setRoomCreator={setRoomCreator}
        setShowLobbyModal={setShowLobbyModal}
      />
      <PerformanceCodeRejectionModal
        show={showPerformanceCodeRejectionModal}
        setShow={setShowPerformanceCodeRejectionModal}
      />
      <LobbyModal
        show={showLobbyModal}
        setShow={setShowLobbyModal}
        gameState={gameState}
        roomCreator={roomCreator}
        roomName={roomName}
        sendMessage={sendMessage}
        feedbackQuestion={feedbackQuestion}
        userId={userId}
      />
      <PostPerformancePerformerFeedbackModal
        show={showPostPerformancePerformerFeedbackModal}
        setShow={setShowPostPerformancePerformerFeedbackModal}
        roomCreator={roomCreator}
        roomName={roomName}
        sendMessage={sendMessage}
        feedbackQuestion={feedbackQuestion}
        userId={userId}
      />
    </>
  );
};

export default PerformPage;
