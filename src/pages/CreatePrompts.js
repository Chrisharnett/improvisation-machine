import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import { CreatePromptSuccessModal } from "../modals/CreatePromptSuccessModal";

const CreatePrompts = () => {
  const [newPrompt, setNewPrompt] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [newTag, setNewTag] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedPrompt, setSavedPrompt] = useState("");

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
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setSelectedTags(new Set([...selectedTags, newTag]));
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
        // {
        //   headers: {
        //     Authorization: token,
        //   },
        // }
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
      <Container>
        <h1> Use this page to create prompts </h1>
        <Form className="container w-50 justify-content-center">
          <Form.Group className="mb-3">
            <Form.Label className="" htmlFor="newPrompt">
              Prompt:{" "}
            </Form.Label>
            <Form.Control
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
              {tags.map((tag, index) => (
                <Col key={index}>
                  <Form.Check
                    key={index}
                    type="checkbox"
                    label={tag}
                    checked={selectedTags.has(tag)}
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
              />
              <Button className="" variant="success" onClick={handleAddTag}>
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
    </>
  );
};

export default CreatePrompts;
