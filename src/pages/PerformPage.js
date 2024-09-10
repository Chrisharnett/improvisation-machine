import { Container, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { TopSpacer } from "../util/TopSpacer.js";
import { useWebSocket } from "../util/WebSocketContext.js";
import MessageCard from "../components/MessageCard.js";
import OptionCard from "../components/OptionCard.js";
import useUser from "../auth/useUser.js";
import { v4 as uuidv4 } from "uuid";
import LobbyView from "../views/LobbyView.js";
import GameView from "../views/GameView.js";
import { ErrorModal } from "../modals/ErrorModal.js";

const PerformPage = ({ loggedIn, LogInUrl }) => {
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [responseRequired, setResponseRequired] = useState(false);
  const [screenName, setScreenName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [gameState, setGameState] = useState(null);
  const [userId, setUserId] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const [roomCreator, setRoomCreator] = useState(false);
  const [feedbackQuestion, setFeedbackQuestion] = useState(null);
  const [finalPrompt, setFinalPrompt] = useState(false);
  const [summary, setSummary] = useState(null);
  const [gameStatus, setGameStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { sendMessage, incomingMessage } = useWebSocket();

  const user = useUser();

  const messageActions = ["welcome", "registration", "debrief"];

  useEffect(() => {
    if (incomingMessage) {
      const message = JSON.parse(incomingMessage);
      if (message.errorMessage) {
        setErrorMessage(message.errorMessage);
        setShowErrorModal(true);
      }
      if (message.action === "newGameState") {
        setChatMessage("");
        setFeedbackQuestion("");
        setSummary(message.summary);
        setFinalPrompt(null);
        setGameStatus(message.gameStatus);
        setGameState(message.gameState);
        setRoomName(message.roomName);
        for (let i in message.gameState.performers) {
          if (message.gameState.performers[i].userId === userId) {
            setCurrentPlayer(message.gameState.performers[i]);
            console.log(
              "New Game State: ",
              message.gameState.performers[i].currentPrompts
            );
          }
        }
      } else if (messageActions.includes(message.action)) {
        setChatMessage(message.message);
        if (message.responseRequired) {
          setResponseRequired(message);
        }
        setGameStatus(message.action);
      } else if (message.action === "newPlayer") {
        setGameState(message.gameState);
        setRoomName(message.roomName);
      } else if (message.action === "endSong") {
        setGameStatus(message.action);
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
        setGameStatus(message.gameStatus);
        setChatMessage(message.summary);
        resetPlayer();
      } else if (message.action === "finalSummary") {
        setChatMessage(message);
      }
      if (message.feedbackQuestion) {
        const type = message.feedbackQuestion.feedbackType;
        if (type === "performerLobby") {
          for (let i in message.feedbackQuestion.questions) {
            if (message.feedbackQuestion.questions[i].userId === userId) {
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
            if (message.feedbackQuestion.questions[i].userId === userId) {
              setResponseRequired(message.responseRequired);
              setChatMessage(message.feedbackQuestion.questions[i].question);
              setFeedbackQuestion(message.feedbackQuestion.questions[i]);
              setGameStatus("debrief");
            }
          }
        }
      }
    }
  }, [incomingMessage, userId]);

  useEffect(() => {
    console.log("User: ", user);
    if (user) {
      setUserId(user.sub);
    }
  }, []);

  const handleChatResponse = (response) => {
    if (responseRequired.responseAction === "newScreenName") {
      setScreenName(response);
      sendMessage(
        JSON.stringify({
          action: "registration",
          userId: userId,
          screenName: response,
        })
      );
    } else if (responseRequired.responseAction === "newInstrument") {
      setInstrument(response);
      sendMessage(
        JSON.stringify({
          action: "registration",
          userId: userId,
          screenName: screenName,
          instrument: response,
          roomCreator: roomCreator,
        })
      );
    } else if (responseRequired.responseAction === "joinRoom") {
      setRoomName(response);
      sendMessage(
        JSON.stringify({
          action: "registration",
          roomName: response,
          screenName: screenName,
          userId: userId,
          instrument: instrument,
        })
      );
    } else if (
      responseRequired === "postPerformancePerformerFeedbackResponse"
    ) {
      sendMessage(
        JSON.stringify({
          action: responseRequired,
          roomName: roomName,
          userId: userId,
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
    setGameState(null);
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
      setRoomCreator(true);
      sendMessage(
        JSON.stringify({
          action: "registration",
          userId: userId,
        })
      );
    }
  };

  const handleChooseJoinPerformance = () => {
    setChatMessage("");
    setGameStatus("registration");
    let id = userId;
    if (!id) {
      id = uuidv4();
      setUserId(id);
    }
    sendMessage(
      JSON.stringify({
        action: "registration",
        userId: id,
      })
    );
  };

  const handlePlayAgain = () => {
    sendMessage(
      JSON.stringify({
        action: "playAgain",
        userId: userId,
        screenName: screenName,
        roomName: roomName,
        roomCreator: roomCreator,
      })
    );
  };

  return (
    <>
      <TopSpacer />
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
            </>
          )}
          <Row className="mt-3">
            {gameStatus === "finalSummary" && roomCreator && (
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
                roomCreator={roomCreator}
                sendMessage={sendMessage}
                roomName={roomName}
                userId={userId}
                screenName={screenName}
                setChatMessage={setChatMessage}
              />
            )}
            {(gameStatus === "improvise" || gameStatus === "endSong") && (
              <>
                <GameView
                  currentPlayer={currentPlayer}
                  gameState={gameState}
                  roomName={roomName}
                  sendMessage={sendMessage}
                  finalPrompt={finalPrompt}
                  gameStatus={gameStatus}
                  roomCreator={roomCreator}
                />
              </>
            )}
          </Row>
          {gameState && (
            <>
              <h2> Players </h2>
              {gameState.performers.map((performer, index) => (
                <Col key={performer.screenName + index} sm="auto">
                  <p key={index}>{performer.screenName}</p>
                </Col>
              ))}
            </>
          )}
        </Container>
      </Container>
      <ErrorModal
        show={showErrorModal}
        setShow={setShowErrorModal}
        message={errorMessage}
        setMessage={setErrorMessage}
      />
    </>
  );
};

export default PerformPage;
