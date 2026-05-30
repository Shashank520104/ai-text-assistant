import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const[reply,setReply]=useState("");
  const[loading,setLoading]=useState(false);

  const sendMessage = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: message, // FIXED: Changed key name from 'message' to 'prompt'
          }),
        }
      );

      const data = await response.json();
      setReply(data.reply);    // for casting it in display pannel..//

      console.log(data);

      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Shaurya The AI Model</h1>

      <input 
        type="text"
        placeholder="Enter Your Prompt Here.."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
      {loading && <p>Thinking...</p>}
      <h3>AI response: </h3>
      <p>{reply}</p>
    </>
  );
}

export default App;