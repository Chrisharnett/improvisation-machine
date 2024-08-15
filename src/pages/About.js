import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import getCognitoURL from "../auth/getCognitoURL.js";
import { Link, useNavigate } from "react-router-dom";
import { TopSpacer } from "../util/TopSpacer.js";

const About = () => {
  return (
    <>
      <TopSpacer />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        <Container className="midLayer glass">
          <p>
            The Improvisation Director is a web-based application that explores
            the interaction between artificial intelligence (AI), human emotion
            and creativity in musical improvisation. Using any internet-enabled
            device, performers and audience can join a performance through an
            online interface. The program will poll audience members at regular
            intervals looking for subjective feedback. The program will process
            that data, through AI and provide prompts (e.g. “G minor”,
            “Gradually faster”, “Play a duet with another performer”, “Start a
            rhythm ostinato”) to musicians in real-time, shaping the music
            towards the audience’s desires. This accessible, web-based software
            forges a new pathway in the intersection of AI and musical
            improvisation, leveraging technology to enhance the creative
            dialogue between musicians and their audience.
          </p>
          <p>
            Thanks to support from ArtsNL the Improvisation Director is
            currently under development. To help in developing this project,
            join A5tral 8og on Twitch every Wednesday from 7:30 to 9.
          </p>
        </Container>
      </Container>
    </>
  );
};

export default About;
