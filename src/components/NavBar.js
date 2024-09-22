import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from "axios";
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
  }, [location.search]);

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
