import { Col, Button } from "react-bootstrap";
import PromptCard from "../components/PromptCard";
import { useEffect, useState } from "react";

const GameView = ({
  currentPlayer,
  roomName,
  gameState,
  sendMessage,
  finalPrompt,
  gameStatus,
  roomCreator,
}) => {
  const [buttonText, setButtonText] = useState("Get Ending");
  const [lastPrompt, setLastPrompt] = useState();
  const [disableButton, setDisableButton] = useState(false);

  // useEffect(() => {
  //   setButtonText(gameStatus === "endSong" ? "End Performance" : "Get Ending");
  // }, [gameStatus]);

  useEffect(() => {
    if (finalPrompt) {
      setDisableButton(false);
      setButtonText("End Performance");
      for (let [key, prompt] of Object.entries(currentPlayer.currentPrompts)) {
        if (key === "endPrompt") {
          setLastPrompt(prompt);
        }
      }
    }
  }, [finalPrompt, currentPlayer.currentPrompts]);

  const handleEndSong = () => {
    if (finalPrompt) {
      if (roomCreator) {
        sendMessage(
          JSON.stringify({
            action: "performanceComplete",
            roomName: roomName,
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
        })
      );
    }
  };

  return (
    <>
      {gameStatus === "endSong" && lastPrompt ? (
        <Col>
          <PromptCard
            promptTitle={"Final Prompt"}
            prompt={lastPrompt.prompt}
            userId={currentPlayer.userId}
            gameState={gameState}
            sendMessage={sendMessage}
            roomName={roomName}
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
                  gameState={gameState}
                  sendMessage={sendMessage}
                  roomName={roomName}
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
