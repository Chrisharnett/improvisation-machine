import { Card, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import ThumbsUpDownButtons from "./ThumbsUpDownButtons";

const PromptCard = ({
  promptTitle,
  sendMessage,
  prompt,
  currentPlayer,
  roomName,
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (promptTitle === "currentPrompt") {
      setTitle("Play");
    } else if (promptTitle !== "Final Prompt") {
      setTitle("");
    }
  }, [promptTitle]);

  const handleThumbsUp = () => {
    sendMessage(
      JSON.stringify({
        action: "reactToPrompt",
        reaction: "like",
        promptTitle: promptTitle,
        prompt: prompt,
        roomName: roomName,
        currentPlayer: currentPlayer,
      })
    );
  };

  const handleThumbsDown = () => {
    sendMessage(
      JSON.stringify({
        action: "reactToPrompt",
        currentPlayer: currentPlayer,
        reaction: "reject",
        promptTitle: promptTitle,
        prompt: prompt,
        roomName: roomName,
      })
    );
  };

  useEffect(() => {
    console.log(promptTitle, ": ", prompt);
  }, [prompt, promptTitle]);

  return (
    <>
      <Card
        className="m-2 p-2"
        style={{
          backdropFilter: "blur(10px) saturate(50%)",
          WebkitBackdropFilter: "blur(21px) saturate(50%)",
          backgroundColor: "rgba(1, 1, 1, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.01)",
          borderRadius: "15px",
          color: "rgb(255, 255, 255, 1)",
        }}
      >
        {prompt && (
          <>
            <Card.Title className="p-2 fs-4">{title}</Card.Title>
            <Card.Body className="fs-4">{prompt}</Card.Body>
            <Card.Footer>
              <Row>
                <ThumbsUpDownButtons
                  onThumbsUpClick={handleThumbsUp}
                  onThumbsDownClick={handleThumbsDown}
                />
              </Row>
            </Card.Footer>
          </>
        )}
      </Card>
    </>
  );
};

export default PromptCard;
