import PromptCard from "../components/PromptCard";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const PerformPage = () => {
  const [performanceCode, setPerformanceCode] = useState(null);

  const setPerformanceId = () => {
    const id = uuidv4();
    setPerformanceCode(id);
  };

  useEffect(() => {
    setPerformanceId();
  }, []);

  const handleNextSong = () => {
    setPerformanceId();
  };
  return (
    <>
      <h1> This is the performance interface </h1>
      <PromptCard performanceCode={performanceCode} />
      <Button onClick={handleNextSong}>Next Song</Button>
    </>
  );
};

export default PerformPage;
