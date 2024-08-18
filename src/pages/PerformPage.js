import PromptCard from "../components/PromptCard.js";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { TopSpacer } from "../util/TopSpacer.js";
import { useWebSocket } from "../util/WebSocketContext.js";
import { JoinExistingPerformanceModal } from "../modals/JoinExistingPerformanceModal.js";
import { CreatePerformanceModal } from "../modals/CreatePerformanceModal.js";
import { PerformanceCodeRejectionModal } from "../modals/PerformanceCodeRejectionModal.js";
import { LobbyModal } from "../modals/LobbyModal.js";
import MessageCard from "../components/MessageCard.js";
import OptionCard from "../components/OptionCard.js";
import { PostPerformancePerformerFeedbackModal } from "../modals/PostPerformancePerformerFeedbackModal.js";
import useUser from "../auth/useUser.js";
import { v4 as uuidv4 } from "uuid";
import LobbyFeedbackChat from "../components/LobbyFeedbackChat.js";

const PerformPage = ({ loggedIn, LogInUrl }) => {
  const [prompt, setPrompt] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState(null);
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
  const [gameStatus, setGameStatus] = useState(null);

  const { sendMessage, incomingMessage } = useWebSocket();

  const user = useUser();

  const messageActions = ["welcome", "registration"];

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
      } else if (messageActions.includes(message.action)) {
        setChatMessage(message);
        setGameStatus(message.action);
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
          setGameStatus("lobby");
          setFeedbackQuestion(message.feedbackQuestion.question);
        }
        if (type === "postPerformancePerformerFeedback") {
          setFeedbackQuestion(message.feedbackQuestion);
          setShowPostPerformancePerformerFeedbackModal(true);
        }
      }
    }
  }, [incomingMessage, userId]);

  // useEffect(() => {
  //   if (!loggedIn) {
  //     setShowCreateModal(false);
  //     setShowJoinModal(true);
  //   } else {
  //     setShowJoinModal(false);
  //     setShowCreateModal(true);
  //   }
  // }, [loggedIn]);

  useEffect(() => {
    if (user) {
      setUserId(user.sub);
    }
  }, [user]);

  const handleChatResponse = (response) => {
    // e.preventDefault();
    if (chatMessage.responseAction === "newScreenName") {
      setScreenName(response);
      sendMessage(
        JSON.stringify({
          action: "registration",
          userId: userId,
          screenName: response,
        })
      );
    } else if (chatMessage.responseAction === "newInstrument") {
      sendMessage(
        JSON.stringify({
          action: "registration",
          userId: userId,
          screenName: screenName,
          instrument: response,
          roomCreator: roomCreator,
        })
      );
    } else if (chatMessage.responseAction === "joinRoom") {
      let id = userId;
      if (!id) {
        id = uuidv4();
        setUserId(id);
      }
      setRoomName(response);
      sendMessage(
        JSON.stringify({
          action: "joinRoom",
          roomName: response,
          screenName: screenName,
          userId: id,
          instrument: instrument,
        })
      );
    }
  };

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

  const handleChooseCreatePerformance = () => {
    if (!loggedIn) {
      window.location.href = LogInUrl;
    } else {
      setGameStatus("registration");
      // setChatMessage({ action: "respond", message: "What should I call you?" });
      setRoomCreator(true);
      sendMessage(
        JSON.stringify({
          action: "registration",
          userId: userId,
        })
      );
    }
  };

  const handleChooseJoinPerformance = () => {};

  return (
    <>
      <TopSpacer />
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass">
          {roomName && <h1>{roomName}</h1>}
          {chatMessage && (
            <MessageCard
              message={chatMessage}
              response={chatResponse}
              setResponse={setChatResponse}
              sendMessage={sendMessage}
              handleSubmit={handleChatResponse}
            />
          )}
          {gameStatus === "welcome" && (
            // Render the join and create performance options if there is no current player and the game is in the welcome state
            <>
              <Row>
                <Col>
                  <OptionCard
                    message={"Join Performance"}
                    onClick={handleChooseJoinPerformance}
                  />
                </Col>
                <Col>
                  <OptionCard
                    message={
                      loggedIn
                        ? "Create Performance"
                        : "Log in to create a performance"
                    }
                    onClick={handleChooseCreatePerformance}
                  />
                </Col>
              </Row>
            </>
          )}
          {currentPlayer && <h2>{currentPlayer.screenName}</h2>}
          {gameStatus === "lobby" && (
            <>
              <LobbyFeedbackChat
                sendMessage={sendMessage}
                userId={userId}
                feedbackQuestion={feedbackQuestion}
                roomName={roomName}
              />
            </>
          )}
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
              currentPlayer.currentPrompts &&
              currentPlayer.currentPrompts.map((prompt, index) => (
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
              ))
            )}

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
          </Row>
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
