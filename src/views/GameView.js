import { Col, Button } from "react-bootstrap";
import PromptCard from "../components/PromptCard";
import { useEffect, useState } from "react";

const GameView = ({
  currentPlayer,
  roomName,
  sendMessage,
  finalPrompt,
  gameStatus,
}) => {
  const [buttonText, setButtonText] = useState("Get Ending");
  const [lastPrompt, setLastPrompt] = useState();
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    if (gameStatus === "endSong") {
      setDisableButton(false);
      setButtonText("End Performance");
      for (let [key, prompt] of Object.entries(currentPlayer.currentPrompts)) {
        if (key === "endPrompt") {
          setLastPrompt(prompt.prompt);
        }
      }
    }
  }, [gameStatus]);

  const handleEndSong = () => {
    if (finalPrompt) {
      if (currentPlayer.roomCreator) {
        sendMessage(
          JSON.stringify({
            action: "performanceComplete",
            roomName: roomName,
            currentPlayer: currentPlayer,
          })
        );
      }
      setDisableButton(true);
    } else {
      setDisableButton(true);
      sendMessage(
        JSON.stringify({
          action: "endSong",
          roomName: roomName,
          currentPlayer: currentPlayer,
        })
      );
    }
  };

  return (
    <>
      {gameStatus === "endSong" ? (
        <Col>
          <PromptCard
            promptTitle={"Final Prompt"}
            prompt={lastPrompt}
            userId={currentPlayer.userId}
            sendMessage={sendMessage}
            roomName={roomName}
            currentPlayer={currentPlayer}
          />
        </Col>
      ) : (
        <>
          {Object.entries(currentPlayer.currentPrompts).map(
            ([key, prompt], index) => (
              <Col key={index}>
                <PromptCard
                  key={index}
                  promptTitle={key}
                  prompt={prompt.prompt}
                  userId={currentPlayer.userId}
                  sendMessage={sendMessage}
                  roomName={roomName}
                  currentPlayer={currentPlayer}
                />
              </Col>
            )
          )}
        </>
      )}

      <Button
        variant="warning"
        type="button"
        className="w-100"
        onClick={handleEndSong}
        disabled={disableButton}
      >
        {buttonText}
      </Button>
    </>
  );
};
export default GameView;
