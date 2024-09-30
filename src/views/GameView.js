import { Row, Button } from "react-bootstrap";
import PromptCard from "../components/PromptCard";
import { useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const GameView = ({
  showPrompt,
  currentPlayer,
  roomName,
  sendMessage,
  finalPrompt,
  gameStatus,
}) => {
  const [buttonText, setButtonText] = useState("Get Ending");
  const [lastPrompt, setLastPrompt] = useState();
  const [disableButton, setDisableButton] = useState(false);
  const [promptKeys, setPromptKeys] = useState([]); // Track prompt keys for triggering individual fades

  useEffect(() => {
    setPromptKeys(Object.keys(currentPlayer.currentPrompts)); // Initially set the prompt keys
  }, [currentPlayer.currentPrompts]);

  useEffect(() => {
    if (gameStatus === "endSong") {
      setDisableButton(false);
      setButtonText("End and Log Performance");
      for (let [key, prompt] of Object.entries(currentPlayer.currentPrompts)) {
        if (key === "endPrompt") {
          setLastPrompt(prompt.prompt);
        }
      }
    }
  }, [gameStatus, currentPlayer]);

  useEffect(() => {
    const newPromptKeys = Object.keys(currentPlayer.currentPrompts);
    setPromptKeys((prevKeys) => {
      if (newPromptKeys.length !== prevKeys.length) {
        return newPromptKeys;
      }
      return prevKeys;
    });
  }, [currentPlayer]);

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

  // Separate prompts into two groups: all except performerPrompt, and performerPrompt itself
  const nonPerformerPrompts = promptKeys.filter(
    (key) => key !== "performerPrompt"
  );
  const performerPrompt = promptKeys.find((key) => key === "performerPrompt");

  return (
    <>
      {nonPerformerPrompts.length < 1 && !performerPrompt ? (
        <PromptCard
          promptTitle={"Waiting"}
          prompt={"Your prompt will be here soon!"}
          userId={currentPlayer.userId}
          sendMessage={sendMessage}
          roomName={roomName}
          currentPlayer={currentPlayer}
        />
      ) : (
        <TransitionGroup component={null}>
          {nonPerformerPrompts.map((key, index) => (
            <CSSTransition key={key} timeout={700} classNames="fade">
              <Row>
                <PromptCard
                  promptTitle={key}
                  prompt={currentPlayer.currentPrompts[key]?.prompt}
                  userId={currentPlayer.userId}
                  sendMessage={sendMessage}
                  roomName={roomName}
                  currentPlayer={currentPlayer}
                />
              </Row>
            </CSSTransition>
          ))}

          {/* Render performerPrompt last, if it exists */}
          {performerPrompt && (
            <CSSTransition
              key={performerPrompt}
              timeout={700}
              classNames="fade"
            >
              <Row>
                <PromptCard
                  promptTitle={performerPrompt}
                  prompt={currentPlayer.currentPrompts[performerPrompt]?.prompt}
                  userId={currentPlayer.userId}
                  sendMessage={sendMessage}
                  roomName={roomName}
                  currentPlayer={currentPlayer}
                />
              </Row>
            </CSSTransition>
          )}
        </TransitionGroup>
      )}
      {(!finalPrompt || (finalPrompt && currentPlayer.roomCreator)) && (
        <Button
          variant="warning"
          type="button"
          className="w-100"
          onClick={handleEndSong}
          disabled={disableButton}
        >
          {buttonText}
        </Button>
      )}
    </>
  );
};

export default GameView;
