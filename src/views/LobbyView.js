import { Row, Col, Button } from "react-bootstrap";
import OptionCard from "../components/OptionCard";
import { useEffect, useState } from "react";

const LobbyView = ({
  feedbackQuestion,
  setFeedbackQuestion,
  roomCreator,
  sendMessage,
  roomName,
  userId,
  screenName,
  setChatMessage,
}) => {
  const [disableButton, setDisableButton] = useState(true);
  const [error, setError] = useState("");
  const [userOption, setUserOption] = useState("");

  useEffect(() => {
    if (roomCreator) {
      setDisableButton(false);
    }
  }, [roomCreator]);

  const handleLobbyFeedback = (option) => {
    // e.preventDefault();
    if (!option.trim()) {
      setError("Response cannot be empty.");
    } else {
      sendMessage(
        JSON.stringify({
          action: "performerLobbyFeedbackResponse",
          roomName: roomName,
          feedbackQuestion: feedbackQuestion,
          userId: userId,
          response: option,
          screenName: screenName,
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
        action: "startPerformance",
        roomName: roomName,
        userId: userId,
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
        {roomCreator && (
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
