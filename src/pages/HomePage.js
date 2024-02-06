import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import getCognitoURL from "../auth/getCognitoURL";
import { Link } from "react-router-dom";

const HomePage = ({ loggedIn, setLoggedIn }) => {
  const [entryLink, setEntryLink] = useState(null);

  useEffect(() => {
    if (loggedIn) {
      setEntryLink("/performPage");
    } else {
      setEntryLink(getCognitoURL());
    }
  }, [loggedIn]);
  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        <Link to={entryLink}>
          <Container className="midLayer glass d-flex flex-column align-items-center">
            <h1> Play Some Music</h1>
          </Container>
        </Link>
      </Container>

      <br></br>
    </>
  );
};

export default HomePage;
