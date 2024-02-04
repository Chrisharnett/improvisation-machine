import PromptCard from "../components/PromptCard";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

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
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass">
          <h1> Play based on the prompt. </h1>
          <PromptCard
            performanceCode={performanceCode}
            isLoading={isLoading}
            message={message}
            setMessage={setMessage}
            songEnd={songEnd}
            setSongEnd={setSongEnd}
          />
        </Container>
      </Container>
    </>
  );
};

export default PerformPage;
