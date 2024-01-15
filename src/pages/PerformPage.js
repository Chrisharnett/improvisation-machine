import PromptCard from "../components/PromptCard";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const PerformPage = () => {
  const [performanceCode, setPerformanceCode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  const handleNextSong = () => {
    const id = uuidv4();
    setPerformanceCode(id);
  };
  return (
    <>
      <h1> This is the performance interface </h1>
      <PromptCard performanceCode={performanceCode} isLoading={isLoading} />
      {!performanceCode && !isLoading && (
        <Button onClick={handleNextSong}>Begin Song</Button>
      )}
      {performanceCode && <Button onClick={handleNextSong}>Next Song</Button>}
    </>
  );
};

export default PerformPage;

// useEffect(() => {
//   setPerformanceId();
// }, []);
