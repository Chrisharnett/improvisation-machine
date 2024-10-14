import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

const Navigation = ({
  loggedIn,
  setLoggedIn,
  token,
  saveToken,
  removeToken,
  setError,
  LogInUrl,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [codeProcessed, setCodeProcessed] = useState(false); // Track if the code has been processed

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [token, setLoggedIn]);

  const codeForToken = async (code) => {
    try {
      const callback =
        process.env.REACT_APP_ENV === "prod"
          ? process.env.REACT_APP_COGNITO_CALLBACK_PROD
          : process.env.REACT_APP_COGNITO_CALLBACK_LOCAL;
      const response = await axios.post(
        `${process.env.REACT_APP_AUTH_API}`,
        JSON.stringify({
          code: code,
          redirect_uri: callback,
        })
      );
      const newToken = response.data;

      saveToken(newToken);
      setLoggedIn(true);

      // Navigate away from the callback URL to avoid using the code again
      navigate("/performPage"); // Redirect to a protected page or wherever appropriate
    } catch (error) {
      console.error("Error fetching token:", error);
      setError(error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");

    if (code && !codeProcessed) {
      codeForToken(code);
      setCodeProcessed(true); // Set code as processed
    }
  }, [location.search, codeProcessed]);

  const logOutHandler = () => {
    removeToken();
    setLoggedIn(false);
    navigate("/");
  };

  const logInHandler = () => {
    window.location.href = LogInUrl;
  };

  return (
    <>
      <Navbar
        fixed="top"
        expand="lg"
        className="navbar-dark bg-dark p-2"
        id="top"
      >
        <Container>
          {loggedIn ? (
            <>
              <Navbar.Brand href="/performPage"> Improvise </Navbar.Brand>
            </>
          ) : (
            <>
              <Navbar.Brand href="/"> Improvise </Navbar.Brand>
            </>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/about">
                About this project
              </Nav.Link>
              {loggedIn && (
                <Nav.Link as={Link} to="/playerProfile">
                  Player Profile
                </Nav.Link>
              )}
            </Nav>

            {loggedIn ? (
              <>
                <Nav>
                  <Nav.Link href="#" onClick={logOutHandler}>
                    <h4>Logout</h4>
                  </Nav.Link>
                </Nav>
              </>
            ) : (
              <Nav>
                <Nav.Link href="#login" onClick={logInHandler}>
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
