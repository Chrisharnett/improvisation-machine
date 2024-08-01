import { useEffect, useState, useCallback, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
// import useWebSocket from "../hooks/useWebSocket.js";
import { useNavigate } from "react-router-dom";
import { JoinExistingPerformanceModal } from "../modals/JoinExistingPerformanceModal.js";
import { CreatePerformanceModal } from "../modals/CreatePerformanceModal.js";
import { TopSpacer } from "../util/TopSpacer.js";
import { PerformanceCodeRejectionModal } from "../modals/PerformanceCodeRejectionModal.js";
import getCognitoURL from "../auth/getCognitoURL.js";
import useUser from "../auth/useUser.js";

const JoinOrCreatePerformance = ({ loggedIn, screenName, setScreenName }) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [LogInUrl, setLogInUrl] = useState(getCognitoURL());
  const [
    showPerformanceCodeRejectionModal,
    setShowPerformanceCodeRejectionModal,
  ] = useState(false);

  const navigate = useNavigate();

  const screenNameRef = useRef(screenName);

  const user = useUser();

  useEffect(() => {
    if (user) {
      setShowCreateModal(false);
    }
  }, [loggedIn]);

  // const handleWebSocketMessage = useCallback((event) => {
  //   try {
  //     if (event.data !== "") {
  //       const response = JSON.parse(event.data);
  //       if (response.action === "updateGameState") {
  //         navigate("/performPage", {
  //           state: {
  //             gameState: response.gameState,
  //             screenName: screenNameRef.current,
  //           },
  //         });
  //         setShowCreateModal(false);
  //       } else if (response.message === "Invalid performance code") {
  //         setShowPerformanceCodeRejectionModal(true);
  //         navigate("/");
  //       } else {
  //         console.log("Unknown action: ", response.action);
  //       }
  //     }
  //   } catch (e) {
  //     console.log("Error: " + e);
  //   }
  // }, []);

  // const { ws, sendMessage } = useWebSocket(
  //   process.env.REACT_APP_WEBSOCKET_API_PROD,
  //   handleWebSocketMessage
  // );

  const handleCreatePerformance = () => {
    if (user) {
      setShowCreateModal(true);
    } else {
      window.location.href = LogInUrl;
    }
  };

  const handleJoinExistingPerformance = () => {
    setShowJoinModal(true);
  };

  return (
    <>
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        <Row>
          <Col>
            <Container
              className="midLayer glass d-flex flex-column align-items-center"
              onClick={handleCreatePerformance}
              style={{ cursor: "pointer" }}
            >
              <h1> Create Performance </h1>
            </Container>{" "}
          </Col>
          <Col>
            <Container
              className="midLayer glass d-flex flex-column align-items-center"
              onClick={handleJoinExistingPerformance}
              style={{ cursor: "pointer" }}
            >
              <h1> Join Performance </h1>
            </Container>{" "}
          </Col>
        </Row>
      </Container>
      <JoinExistingPerformanceModal
        show={showJoinModal}
        setShow={setShowJoinModal}
        // handleWebSocketMessage={handleWebSocketMessage}
        // sendMessage={sendMessage}
        screenName={screenName}
        setScreenName={setScreenName}
      />
      <CreatePerformanceModal
        show={showCreateModal}
        setShow={setShowCreateModal}
        screenName={screenName}
        setScreenName={setScreenName}
        user={user}
        // handleWebSocketMessage={handleWebSocketMessage}
        // sendMessage={sendMessage}
      />
      <PerformanceCodeRejectionModal
        show={showPerformanceCodeRejectionModal}
        setShow={setShowPerformanceCodeRejectionModal}
      />
    </>
  );
};

export default JoinOrCreatePerformance;
