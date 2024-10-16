import { Container } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

const HomePage = () => {
  const [showContainer, setShowContainer] = useState(false);

  const nodeRef = useRef(null);

  useEffect(() => {
    setShowContainer(true);
    return () => {
      setShowContainer(false);
    };
  }, []);

  return (
    <>
      <CSSTransition
        in={showContainer}
        timeout={700} // Timeout should match the transition duration in CSS
        classNames="fade"
        unmountOnExit
        nodeRef={nodeRef}
      >
        <>
          <Container
            className="d-flex align-items-center justify-content-center"
            style={{ height: "70vh", width: "100vw" }}
            ref={nodeRef}
          >
            <Link to={"/performPage"}>
              <Container className="midLayer glass d-flex flex-column align-items-center">
                <h1> Play Music </h1>
              </Container>
            </Link>
          </Container>
        </>
      </CSSTransition>
    </>
  );
};

export default HomePage;
