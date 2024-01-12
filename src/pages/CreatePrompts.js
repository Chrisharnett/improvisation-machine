import { Button, Form, Container } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import { CreatePromptSuccessModal } from "../modals/CreatePromptSuccessModal";

const CreatePrompts = () => {
  const [newPrompt, setNewPrompt] = useState("");
  const [newPromptTags, setNewPromptTags] = useState("");
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [savedPrompt, setSavedPrompt] = useState("");

  const handleAddPrompt = async () => {
    const tagsArray = newPromptTags.split(",").map((tag) => tag.trim());
    try {
      const newPromptObject = { Prompt: newPrompt, Tags: tagsArray };
      const response = await axios.post(
        `${process.env.REACT_APP_PROMPT_API}`,
        newPromptObject
      );
      setSavedPrompt(newPrompt);
      setShowSuccessModal(true);
      setNewPrompt("");
      setNewPromptTags("");
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
            <Form.Label className="blue-text" htmlFor="manufacturer">
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
            <Form.Label className="blue-text" htmlFor="model">
              Tags:{" "}
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Solo, duo, ensemble, ending, start. Seperate by ' , '"
              id="tags"
              value={newPromptTags}
              onChange={(e) => setNewPromptTags(e.target.value)}
            />
          </Form.Group>
          <hr></hr>

          <Button className="green-button" onClick={handleAddPrompt}>
            Add Prompt
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
