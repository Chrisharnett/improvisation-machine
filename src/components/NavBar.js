import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";

const Navigation = ({ loggedIn, logInHandler, logOutHandler }) => {
  return (
    <Navbar
      fixed="top"
      expand="lg"
      className="navbar-dark bg-dark p-2"
      id="top"
    >
      <Container>
        <Navbar.Brand href={loggedIn ? "/performPage" : "/"}>
          Improvise
        </Navbar.Brand>
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
            <Nav>
              <Nav.Link href="#" onClick={logOutHandler}>
                <h4>Logout</h4>
              </Nav.Link>
            </Nav>
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
  );
};

export default Navigation;
