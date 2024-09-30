import { Row, Col, Button } from "react-bootstrap";
import OptionCard from "../components/OptionCard";
import { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";

const LobbyView = ({
  feedbackQuestion,
  setFeedbackQuestion,
  sendMessage,
  roomName,
  currentPlayer,
  setChatMessage,
}) => {
  const [disableButton, setDisableButton] = useState(true);
  const [error, setError] = useState("");
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (currentPlayer.roomCreator) {
      setDisableButton(false);
    }
    setShowContent(true);
  }, [currentPlayer.roomCreator]);

  const handleLobbyFeedback = (option) => {
    if (!option.trim()) {
      setError("Response cannot be empty.");
    } else {
      sendMessage(
        JSON.stringify({
          action: "performerLobbyFeedbackResponse",
          roomName: roomName,
          feedbackQuestion: feedbackQuestion,
          currentPlayer: currentPlayer,
          response: option,
        })
      );
      setChatMessage(option);
      setFeedbackQuestion("");
      setError("");
    }
  };

  const handleStartPerformance = (e) => {
    e.preventDefault();
    sendMessage(
      JSON.stringify({
        action: "announceStartPerformance",
        roomName: roomName,
        currentPlayer: currentPlayer,
      })
    );
    sendMessage(
      JSON.stringify({
        action: "startPerformance",
        roomName: roomName,
        currentPlayer: currentPlayer,
      })
    );
    setDisableButton(true);
  };
  return (
    <>
      <CSSTransition
        in={showContent}
        timeout={700} // Timeout should match the transition duration in CSS
        classNames="fade"
        unmountOnExit
      >
        <Row>
          {feedbackQuestion?.question?.options?.map((option, index) => (
            <Col key={index}>
              <OptionCard
                key={index}
                message={option}
                onClick={handleLobbyFeedback}
              />
            </Col>
          ))}
          {currentPlayer?.roomCreator && (
            <Button
              variant="success"
              onClick={handleStartPerformance}
              disabled={disableButton}
            >
              Start Performance
            </Button>
          )}
        </Row>
      </CSSTransition>
    </>
  );
};
export default LobbyView;
