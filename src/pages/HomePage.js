import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import getCognitoURL from "../auth/getCognitoURL";
import { Link, useNavigate } from "react-router-dom";

const HomePage = ({ loggedIn, setLoggedIn }) => {
  // const [entryLink, setEntryLink] = useState(null);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (loggedIn) {
  //     navigate("/performPage");
  //   } else {
  //     setEntryLink(getCognitoURL());
  //   }
  // }, [loggedIn]);

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        <Link to={"/performPage"}>
          <Container className="midLayer glass d-flex flex-column align-items-center">
            <h1> Play Music </h1>
          </Container>
        </Link>
      </Container>
    </>
  );
};

export default HomePage;
