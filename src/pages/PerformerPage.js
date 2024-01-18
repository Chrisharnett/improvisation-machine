import PromptCard from "../components/PromptCard";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const PerformPage = () => {
  const [performanceCode, setPerformanceCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("This takes a moment.");
  const [songEnd, setSongEnd] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

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
    </>
  );
};

export default PerformPage;
