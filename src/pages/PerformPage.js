import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Spacer } from "../util/Spacer.js";
import { useWebSocket } from "../util/WebSocketContext.js";
import MessageCard from "../components/MessageCard.js";
import OptionCard from "../components/OptionCard.js";
import useUser from "../auth/useUser.js";
import { v4 as uuidv4 } from "uuid";
import LobbyView from "../views/LobbyView.js";
import GameView from "../views/GameView.js";
import { MessageModal } from "../modals/MessageModal.js";

const PerformPage = ({
  loggedIn,
  LogInUrl,
  currentPlayer,
  setCurrentPlayer,
}) => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [responseRequired, setResponseRequired] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [feedbackQuestion, setFeedbackQuestion] = useState(null);
  const [finalPrompt, setFinalPrompt] = useState(false);
  const [summary, setSummary] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [disableTimer, setDisableTimer] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(true);
  const [performerList, setPerformerList] = useState([]);

  const { sendMessage, incomingMessage, ready } = useWebSocket();

  const user = useUser();

  const messageActions = ["welcome", "registration", "debrief"];

  useEffect(() => {
    const sendMessageWhenReady = async () => {
      if (ready) {
        sendMessage(
          JSON.stringify({
            action: "getStarted",
            currentPlayer: currentPlayer,
          })
        );
      }
    };
    sendMessageWhenReady();
  }, [ready]);

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      if (message.errorMessage) {
        setModalMessage(message.errorMessage);
        setShowMessageModal(true);
      }
      if (message.gameState) {
        setShowMessageModal(false);
        setDisableTimer(false);
        setChatMessage("");
        setFeedbackQuestion("");
        setSummary(message.summary);
        setFinalPrompt(null);
        setGameStatus(message.gameStatus);
        setRoomName(message.roomName);
        for (let i in message.gameState.performers) {
          const screenName = message.gameState.performers[i].screenName;
          if (!performerList.includes(screenName)) {
            setPerformerList((prevList) => [...prevList, screenName]);
          }
          if (message.gameState.performers[i].userId === currentPlayer.userId) {
            setCurrentPlayer(message.gameState.performers[i]);
            console.log(
              "New Game State: ",
              message.gameState.performers[i].currentPrompts
            );
          }
        }
      }

      if (message.action === "announcement") {
        setModalMessage(message.message);
        if (message.disableTimer) {
          setDisableTimer(true);
        }
        setShowMessageModal(true);
      } else if (messageActions.includes(message.action)) {
        setChatMessage(message.message);
        if (message.responseRequired) {
          setResponseRequired(message);
        }
        setGameStatus(message.action);
      } else if (message.action === "resetPlayer") {
        resetPlayer();
      } else if (message.action === "finalSummary") {
        setGameStatus(message.gameStatus);
        setChatMessage(message.summary);
        resetPlayer();
      }

      if (message.gameStatus === "endSong") {
        setGameStatus(message.action);
        setFinalPrompt(true);
      }

      if (message.feedbackQuestion) {
        const type = message.feedbackQuestion.feedbackType;
        if (type === "performerLobby") {
          for (let i in message.feedbackQuestion.questions) {
            if (
              message.feedbackQuestion.questions[i].userId ===
              currentPlayer.userId
            ) {
              setResponseRequired(message.responseRequired);
              setChatMessage(
                message.feedbackQuestion.questions[i].question.question
              );
              setFeedbackQuestion(message.feedbackQuestion.questions[i]);
              setGameStatus(message.gameStatus);
            }
          }

          setRoomName(message.roomName);
        }
        if (type === "postPerformancePerformerFeedback") {
          for (let i in message.feedbackQuestion.questions) {
            if (
              message.feedbackQuestion.questions[i].userId ===
              currentPlayer.userId
            ) {
              setResponseRequired(message.responseRequired);
              setChatMessage(message.feedbackQuestion.questions[i].question);
              setFeedbackQuestion(message.feedbackQuestion.questions[i]);
              setGameStatus("debrief");
            }
          }
        }
      }
    }
  }, [incomingMessage]);

  const handlePerformanceModeSwitch = (e) => {
    setPerformanceMode(e.target.checked);
  };

  const handleChatResponse = (response) => {
    if (responseRequired.responseAction === "newScreenName") {
      const updatedUser = { ...user, screenName: response };
      setCurrentPlayer(updatedUser);

      sendMessage(
        JSON.stringify({
          action: "registration",
          currentPlayer: updatedUser,
          loggedIn: loggedIn,
        })
      );
    } else if (responseRequired.responseAction === "newInstrument") {
      const updatedUser = { ...user, instrument: response };
      setCurrentPlayer(updatedUser);
      sendMessage(
        JSON.stringify({
          action: "registration",
          currentPlayer: updatedUser,
          loggedIn: loggedIn,
        })
      );
    } else if (responseRequired.responseAction === "joinRoom") {
      const roomName = response.toLowerCase().trim();
      setRoomName(roomName);
      sendMessage(
        JSON.stringify({
          action: "registration",
          roomName: roomName,
          currentPlayer: currentPlayer,
          loggedIn: loggedIn,
        })
      );
    } else if (
      responseRequired === "postPerformancePerformerFeedbackResponse"
    ) {
      sendMessage(
        JSON.stringify({
          action: responseRequired,
          roomName: roomName,
          currentPlayer: currentPlayer,
          question: chatMessage,
          response: response,
        })
      );
    }
    setChatMessage("");
    setChatResponse("");
    setResponseRequired(false);
  };

  const resetPlayer = () => {
    setFeedbackQuestion(null);
    setFinalPrompt(false);
    currentPlayer.currentPrompts = [];
  };

  const handleChooseCreatePerformance = () => {
    if (!loggedIn) {
      window.location.href = LogInUrl;
    } else {
      setChatMessage("");
      setGameStatus("registration");
      currentPlayer.roomCreator = true;
      sendMessage(
        JSON.stringify({
          action: "registration",
          currentPlayer: currentPlayer,
          loggedIn: loggedIn,
          performanceMode: performanceMode,
        })
      );
    }
  };

  const handleChooseJoinPerformance = () => {
    setChatMessage("");
    setGameStatus("registration");
    let id = currentPlayer.userId;
    if (!id) {
      id = uuidv4();
      currentPlayer.userId = id;
    }
    sendMessage(
      JSON.stringify({
        action: "registration",
        currentPlayer: currentPlayer,
        loggedIn: loggedIn,
      })
    );
  };

  const handlePlayAgain = () => {
    sendMessage(
      JSON.stringify({
        action: "playAgain",
        currentPlayer: currentPlayer,
        roomName: roomName,
      })
    );
  };

  const { screenName } = currentPlayer || "";

  return (
    <>
      <Spacer />
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass">
          {roomName && <h1>{roomName}</h1>}
          {screenName && <h2>{screenName}</h2>}
          {chatMessage && (
            <MessageCard
              message={chatMessage}
              response={chatResponse}
              responseRequired={responseRequired}
              setResponse={setChatResponse}
              handleSubmit={handleChatResponse}
            />
          )}
          {gameStatus === "welcome" && (
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
              <Form>
                <Form.Switch
                  type="switch"
                  id="performanceMode"
                  label="Performance Mode"
                  checked={performanceMode}
                  onChange={handlePerformanceModeSwitch}
                />
              </Form>
            </>
          )}
          <Row className="mt-3">
            {gameStatus === "finalSummary" && currentPlayer?.roomCreator && (
              <>
                <>
                  <Button
                    variant="success"
                    type="button"
                    className="w-100"
                    onClick={handlePlayAgain}
                  >
                    {"Play Again!"}
                  </Button>
                </>
              </>
            )}
            {gameStatus === "Waiting To Start" && (
              <LobbyView
                feedbackQuestion={feedbackQuestion}
                setFeedbackQuestion={setFeedbackQuestion}
                sendMessage={sendMessage}
                roomName={roomName}
                currentPlayer={currentPlayer}
                setChatMessage={setChatMessage}
              />
            )}
            {(gameStatus === "improvise" || gameStatus === "endSong") && (
              <>
                <GameView
                  currentPlayer={currentPlayer}
                  roomName={roomName}
                  sendMessage={sendMessage}
                  finalPrompt={finalPrompt}
                  gameStatus={gameStatus}
                />
              </>
            )}
          </Row>
          {performerList.length > 0 && (
            <>
              <h2> Players </h2>
              {performerList.map((performer, index) => (
                <Col key={index} sm="auto">
                  <p>{performer}</p>
                </Col>
              ))}
            </>
          )}
        </Container>
      </Container>
      <MessageModal
        show={showMessageModal}
        setShow={setShowMessageModal}
        message={modalMessage}
        setMessage={setModalMessage}
        disableTimer={disableTimer}
      />
    </>
  );
};

export default PerformPage;
