import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import getCognitoUrl from "../auth/getCognitoURL";
import axios from "axios";
import { useToken } from "../auth/useToken";

const Navigation = () => {
  const [, saveToken] = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null);

  const codeForToken = async (code) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_AUTH_API}`, {
        body: JSON.stringify({ code: code }),
      });
      const token = response.data.body;
      if (token.id_token) {
        saveToken(token);
        setLoggedIn(true);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code) {
      codeForToken(code);
    }
  }, []);

  const logOutHandler = () => {
    saveToken(null);
    setLoggedIn(false);
    navigate("/");
  };

  const logInHandler = () => {
    const url = getCognitoUrl();
    window.location.href = url;
  };

  return (
    <>
      <Navbar expand="lg" className="navbar-dark bg-dark p-2" id="top">
        <Container>
          <Navbar.Brand href="/">Improvisation Game</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {loggedIn && (
                <>
                  <Nav.Link href="/performPage">Perform</Nav.Link>
                  <Nav.Link href="/createPrompts">Create Prompts</Nav.Link>
                </>
              )}
              {!loggedIn && (
                <Nav.Link href="/joinPerformance">Join Performance</Nav.Link>
              )}
            </Nav>

            {loggedIn && (
              <Nav>
                <Nav.Link className="" href="#" onClick={logOutHandler}>
                  <h4>Logout</h4>
                </Nav.Link>
              </Nav>
            )}
            {!loggedIn && (
              <Nav>
                <Nav.Link className="" href="#login" onClick={logInHandler}>
                  <h4>Login</h4>
                </Nav.Link>
              </Nav>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
