import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { CreatePromptSuccessModal } from "../modals/CreatePromptSuccessModal";
import { useToken } from "../auth/useToken";

const CreatePrompts = () => {
  const [newPrompt, setNewPrompt] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedPrompt, setSavedPrompt] = useState("");
  const [token] = useToken();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_TAGS_API}`);
        const tagsArray = JSON.parse(response.data.body);
        setTags(tagsArray);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setError(error);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (tag, isChecked) => {
    const newSelectedTags = new Set(selectedTags);
    if (isChecked) {
      newSelectedTags.add(tag);
    } else {
      newSelectedTags.delete(tag);
    }
    setSelectedTags(newSelectedTags);
  };

  const handleAddTag = () => {
    if (newTag !== "" && ![...tags].includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);

      const newSelectedTags = new Set(selectedTags);
      newSelectedTags.add(newTag);
      setSelectedTags(newSelectedTags);
      setNewTag("");
    }
  };

  const handleAddPrompt = async () => {
    try {
      const newPromptObject = {
        Prompt: newPrompt,
        Tags: Array.from(selectedTags),
      };
      const response = await axios.post(
        `${process.env.REACT_APP_PROMPT_API}`,
        newPromptObject
      );
      setSavedPrompt(newPrompt);
      setShowSuccessModal(true);
      setNewPrompt("");
      setSelectedTags([]);
    } catch (error) {
      console.error("Error:", error.response || error);
      setError(error);
    }
    setError(error);
  };

  return (
    <>
      <div style={{ height: "10vh" }}></div>
      <Container className="fullVHeight d-flex justify-content-center align-items-center">
        <Container className="midLayer glass my-3">
          <h1> Create new prompts. </h1>
          <p>Tags help define how they behave in performance.</p>
          <Form className="justify-content-center">
            <Form.Group className="mb-3">
              <Form.Label className="" htmlFor="newPrompt">
                Prompt:{" "}
              </Form.Label>
              <Form.Control
                style={{ maxWidth: "100vh" }}
                type="text"
                placeholder="a prompt to guide creation"
                id="prompt"
                value={newPrompt}
                onChange={(e) => setNewPrompt(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="mb-3">Tags:</Form.Label>
              <Row xs={1} sm={3} md={4} lg={5} className="g-3">
                {tags.sort().map((tag, index) => (
                  <Col key={index}>
                    <Form.Check
                      key={index}
                      type="checkbox"
                      label={tag}
                      checked={
                        selectedTags instanceof Set && selectedTags.has(tag)
                      }
                      onChange={(e) => handleTagChange(tag, e.target.checked)}
                    />
                  </Col>
                ))}
              </Row>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "10px",
                }}
              >
                <Form.Control
                  type="text"
                  placeholder="Add new tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  style={{ maxWidth: "100vh", marginRight: "5vh" }}
                  className="mt-3"
                />
                <Button
                  className="mt-3"
                  variant="success"
                  onClick={handleAddTag}
                >
                  Add New Tag
                </Button>
              </div>
            </Form.Group>
            <hr></hr>

            <Button className="" onClick={handleAddPrompt}>
              Create Prompt
            </Button>
            <div style={{ height: "15vh" }}></div>
          </Form>
        </Container>
        <br></br>
        <CreatePromptSuccessModal
          show={showSuccessModal}
          setShow={setShowSuccessModal}
          prompt={savedPrompt}
        />
      </Container>
      <div style={{ height: "10vh" }}></div>
    </>
  );
};

export default CreatePrompts;
