import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";
import useWebSocket from "../util/UseWebSocket";

const PromptCard = ({ performanceCode }) => {
  const [prompt, setPrompt] = useState(null);
  const [ignore, setIgnore] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState(null);
  const [logPrompt, setLogPrompt] = useState(null);

  const ws = useWebSocket({ setPrompt });

  const sendMessage = (message) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(message);
    }
  };

  const onMessageReceived = (event) => {
    try {
      const receivedPrompt = JSON.parse(event.data);
      setPrompt(receivedPrompt);
      setStartTime(new Date().toIseString());
    } catch (e) {
      setError(e);
    }
  };

  // const fetchPrompt = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_PROMPT_API}`);
  //     setPrompt(response.data);
  //     const startTime = new Date().toISOString();
  //     setStartTime(startTime);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setError(error);
  //   }
  // };
  // useEffect(() => {
  //   fetchPrompt();
  // }, []);

  const handleIgnorePrompt = () => {
    setIgnore(true);
    handleNextPrompt();
  };
  const handleNextPrompt = () => {
    const newEndTime = new Date().toISOString();
    setEndTime(newEndTime);
    setLogPrompt({
      performanceCode,
      ...prompt,
      startTime: startTime,
      endTime: newEndTime,
      ignore: ignore,
    });
    sendMessage(JSON.stringify({ action: "sendPrompt" }));
    setIgnore(false);
  };

  if (error) return <div>Error loading data.</div>;

  return (
    <>
      <Card style={{ width: "50rem" }} className="m-5 text-center">
        <Card.Body className="align-items-center">
          {prompt && (
            <Card.Title className="fs-1">{prompt.body.Prompt}</Card.Title>
          )}
          {!prompt && <Card.Title className="fs-1">Loading...</Card.Title>}
          <Card.Text className=""></Card.Text>
          <Button type="submit" className="mx-2" onClick={handleNextPrompt}>
            Next Prompt
          </Button>
          <Button
            type="submit"
            variant="danger"
            className="mx-2"
            onClick={handleIgnorePrompt}
          >
            Ignore Prompt
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default PromptCard;
