import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Card,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
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
  const [currentPrompts, setCurrentPrompts] = useState([]);
  const [filteredPrompts, setFilteredPrompts] = useState(currentPrompts);
  const [promptFilter, setPromptFilter] = useState(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_TAGS_API}`);
        const tagsArray = JSON.parse(response.data.body);
        setTags(tagsArray);
        const promptResponse = await axios.get(
          `${process.env.REACT_APP_PROMPT_API}`
        );
        const promptsArray = promptResponse.data;
        setCurrentPrompts(promptsArray);
        setFilteredPrompts(promptsArray);
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
      setShowSuccessModal(true);
      const newPromptObject = {
        Prompt: newPrompt,
        Tags: Array.from(selectedTags),
      };
      const response = await axios.post(
        `${process.env.REACT_APP_PROMPT_API}`,
        newPromptObject
      );
      setSavedPrompt(newPrompt);
      setNewPrompt("");
      setSelectedTags([]);
    } catch (error) {
      console.error("Error:", error.response || error);
      setError(error);
    }
    setError(error);
  };

  useEffect(() => {
    if (promptFilter) {
      const filtered = currentPrompts.filter((prompt) =>
        prompt.Tags.includes(promptFilter)
      );
      setFilteredPrompts(filtered);
    } else {
      setFilteredPrompts(currentPrompts);
    }
  }, [promptFilter, currentPrompts]);

  return (
    <>
      <div style={{ height: "10vh" }}></div>
      <Container className="fullVHeight d-flex flex-column align-items-center">
        <Container className="midLayer glass my-3 p-2" style={{ width: "80%" }}>
          <h1> Create new prompts. </h1>
          <p>Tags define how a prompt behaves during performance.</p>
          <Form>
            <Form.Label className="" htmlFor="newPrompt">
              Prompt:{" "}
            </Form.Label>
            <Row className="align-items-center">
              <Col>
                <Form.Control
                  // className="mb-2"
                  // style={{ width: "auto" }}
                  type="text"
                  placeholder="a prompt to guide creation"
                  id="prompt"
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button className="" onClick={handleAddPrompt}>
                  Create Prompt
                </Button>
              </Col>
            </Row>

            <Form.Label className="mb-3">Tags:</Form.Label>
            <Row xs={1} sm={3} md={4} lg={5} className="g-3">
              {tags.sort().map((tag, index) => (
                <Col key={index}>
                  <Form.Check
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
                style={{ maxWidth: "50vh", marginRight: "5vh" }}
              />
              <Button variant="success" onClick={handleAddTag}>
                Add New Tag
              </Button>
            </div>
          </Form>
        </Container>

        <Container className="midLayer my-3 p-4" style={{ width: "80%" }}>
          <Card
            style={{
              backdropFilter: "blur(10px) saturate(50%)",
              WebkitBackdropFilter: "blur(21px) saturate(50%)",
              backgroundColor: "rgba(1, 1, 1, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.01)",
              borderRadius: "15px",
              color: "rgb(255, 255, 255, 1)",
            }}
          >
            <Card.Title className="fs-3 p-2">
              Current Prompts
              <DropdownButton
                className="mt-2"
                title={
                  promptFilter ? `Filter: ${promptFilter}` : "Filter Prompts"
                }
              >
                <Dropdown.Item onClick={() => setPromptFilter(null)}>
                  Show All
                </Dropdown.Item>

                {tags.sort().map((tag, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => setPromptFilter(tag)}
                  >
                    {tag}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Card.Title>
            <Card.Body>
              <Row className="mb-2">
                <Col sm="6">
                  <h4>Prompt</h4>
                </Col>
                <Col>
                  <h4>Tags</h4>
                </Col>
              </Row>
              {filteredPrompts.map((prompt, index) => (
                <Row key={index}>
                  <Col sm="6">
                    <Card.Text>{prompt.Prompt}</Card.Text>
                  </Col>
                  <Col>
                    <Card.Text key={index}>{prompt.Tags.join(", ")}</Card.Text>
                  </Col>
                </Row>
              ))}
            </Card.Body>
          </Card>
        </Container>
      </Container>

      <div style={{ height: "10vh" }}></div>
      <CreatePromptSuccessModal
        show={showSuccessModal}
        setShow={setShowSuccessModal}
        prompt={savedPrompt}
      />
    </>
  );
};

export default CreatePrompts;
