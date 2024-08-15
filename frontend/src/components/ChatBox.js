const ChatBox = ({ message, setMessage, sendMessage, prompt }) => {
  const handleSendMessage = () => {
    sendMessage(
      JSON.stringify({
        action: "chat",
        message: message,
      })
    );
    setMessage("");
  };

  return (
    <>
      {" "}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={handleSendMessage}>Send</button>
      {prompt && <p>Response from server: {prompt}</p>}
    </>
  );
};

export default ChatBox;
