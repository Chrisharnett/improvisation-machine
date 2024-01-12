import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import axios from "axios";

const PromptCard = ({ performanceCode }) => {
  const [prompt, setPrompt] = useState(null);
  const [ignore, setIgnore] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState(null);
  const [logPrompt, setLogPrompt] = useState(null);

  const fetchPrompt = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_PROMPT_API}`);
      setPrompt(response.data);
      const startTime = new Date().toISOString();
      setStartTime(startTime);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchPrompt();
  }, []);

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
    fetchPrompt();
    setIgnore(false);
  };

  if (error) return <div>Error loading data.</div>;
  if (!prompt) return <div>Loading...</div>;

  return (
    <>
      <Card style={{ width: "50rem" }} className="m-5 text-center">
        <Card.Body className="align-items-center">
          <Card.Title className="fs-1">{prompt.body.Prompt}</Card.Title>
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
