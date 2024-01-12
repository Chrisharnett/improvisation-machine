import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

const Navigation = () => {
  return (
    <>
      <Navbar expand="lg" className="navbar-dark bg-dark p-2" id="top">
        <Container>
          <Navbar.Brand href="/">Improvisation Game</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* {loggedIn && ( */}
            <Nav className="me-auto">
              <Nav.Link href="/perform">Perform</Nav.Link>
              <Nav.Link href="/createPrompts">Create Prompts</Nav.Link>
            </Nav>
            {/* )} */}
            {/* {loggedIn && (
              <Nav>
                <Nav.Link className="" href="#" onClick={logOutHandler}>
                  <h4>Logout</h4>
                </Nav.Link>
              </Nav>
            )}
            {!loggedIn && (
              <Nav>
                <Nav.Link
                  className=""
                  href="#login"
                  onClick={() => {
                    window.location.href = cognitoURL;
                  }}
                >
                  <h4>Login</h4>
                </Nav.Link>
              </Nav>
            )} */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Navigation;
