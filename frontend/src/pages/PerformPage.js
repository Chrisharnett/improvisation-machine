import NewPromptCard from "../components/NewPromptCard.js";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { TopSpacer } from "../util/TopSpacer.js";
import ChatBox from "../components/ChatBox.js";
import { useWebSocket } from "../util/WebSocketContext.js";

const PerformPage = ({ loggedIn }) => {
  const [prompt, setPrompt] = useState(null);
  const [message, setMessage] = useState("");
  const { sendMessage, incomingMessage } = useWebSocket();

  useEffect(() => {
    console.log("PerformPage mounted or updated");
    return () => {
      console.log("PerformPage unmounted");
    };
  }, []);

  useEffect(() => {
    if (incomingMessage) {
      setPrompt(incomingMessage);
    }
  }, [incomingMessage]);

  return (
    <>
      <TopSpacer />
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass">
          <h1> Performance</h1>
          <NewPromptCard prompt={prompt || "Loading..."} />
          <ChatBox
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            prompt={prompt}
          />
        </Container>
      </Container>
    </>
  );
};

export default PerformPage;
