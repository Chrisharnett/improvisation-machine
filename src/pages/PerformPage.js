import PromptCard from "../components/PromptCard";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const PerformPage = () => {
  const [performanceCode, setPerformanceCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("Click Begin Song to start");
  const [songEnd, setSongEnd] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleNextSong = () => {
    const id = uuidv4();
    setPerformanceCode(id);
    setMessage("This takes a moment.");
  };
  return (
    <>
      <h1> This is the performance interface </h1>
      <PromptCard
        performanceCode={performanceCode}
        isLoading={isLoading}
        message={message}
        setMessage={setMessage}
        songEnd={songEnd}
        setSongEnd={setSongEnd}
      />
      {!performanceCode && !isLoading && (
        <Button onClick={handleNextSong}>Begin Song</Button>
      )}
      {performanceCode && (
        <Button onClick={handleNextSong} disabled={performanceCode}>
          Next Song
        </Button>
      )}
    </>
  );
};

export default PerformPage;
