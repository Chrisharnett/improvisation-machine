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
        style={{ width: "100vw" }}
      >
        <Container className="midLayer glass">
          {/* <p>
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
          </p> */}
          <p>
            The Improvisation Director is a cutting-edge web application that
            blends artificial intelligence (AI) with human emotion and
            creativity to redefine musical improvisation. Accessible from any
            internet-enabled device, both performers and audience members can
            participate in live performances through an interactive online
            platform. The system collects real-time feedback from the audience
            at regular intervals, processing this data with AI to generate
            dynamic prompts for the musicians, such as “Switch to G minor,”
            “Increase tempo gradually,” “Play a duet,” or “Start a rhythmic
            ostinato.” This innovative software empowers musicians to adapt
            their performances to the evolving preferences of their audience,
            forging a unique and engaging connection at the crossroads of AI and
            music.
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
