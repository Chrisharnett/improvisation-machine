import { useState } from "react";
import { Container } from "react-bootstrap";

const HomePage = () => {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Container className="midLayer glass">
        <h1> Welcome to the A5tral8og improvisation prompting machine </h1>
        <hr></hr>
        {/* <h2>{date.toLocaleDateString("en-CA")}</h2> */}
        This app gives customized prompts to improvisers to help direct the
        creation of spontaneous music. This is the first prototype is designed
        to deliver randomized prompts from a bank of available prompts. Once
        this proof of concept is refined, performers will be given a choice to
        prompts to choose from to create a database of "preferred" prompts. That
        dataset will ideally inform a machine learning model to automate the
        delivery of prompts to users. As that machine learning model grows, the
        app will collect audience feedback during performance to further refine
        the model choices.
        <hr></hr>
        <h2> Join a performance to start playing. </h2>
        <br></br>
        <h2> Login to launch a performance or design prompts. </h2>
      </Container>

      <br></br>
    </>
  );
};

export default HomePage;
