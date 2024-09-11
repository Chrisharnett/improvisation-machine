import { Button } from "react-bootstrap";

const ThumbsUpDownButtons = ({ onThumbsUpClick, onThumbsDownClick }) => {
  return (
    <div>
      <Button
        variant="success"
        onClick={onThumbsUpClick}
        className="m-2 btn-lg"
      >
        <i className="bi bi-hand-thumbs-up"></i>
      </Button>
      <Button
        variant="danger"
        onClick={onThumbsDownClick}
        className="m-2 btn-lg"
      >
        <i className="bi bi-hand-thumbs-down"></i>
      </Button>
    </div>
  );
};

export default ThumbsUpDownButtons;
