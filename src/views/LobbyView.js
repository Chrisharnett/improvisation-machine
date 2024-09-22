import { Row, Col, Button } from "react-bootstrap";
import OptionCard from "../components/OptionCard";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (currentPlayer.roomCreator) {
      setDisableButton(false);
    }
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
    </>
  );
};
export default LobbyView;
