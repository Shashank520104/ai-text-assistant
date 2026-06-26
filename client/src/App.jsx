import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("mentor");
  const [conversation, setConversation] = useState([]);

  // Load Previous Chat History
  const loadHistory = async () => {
    try {
      const response = await fetch("http://localhost:8000/history");

      const data = await response.json();

      console.log("Loaded History:", data);

      setConversation(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Run Once When Component Loads
  useEffect(() => {
    loadHistory();
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      role: "user",
      text: message,
    };

    const updatedConversation = [
      ...conversation,
      userMessage,
    ];

    const recentConversation = updatedConversation.slice(-10);

    try {
      setConversation((prev) => [
        ...prev,
        userMessage,
      ]);

      setMessage("");
      setLoading(true);

      const response = await fetch(
        "http://localhost:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversation: recentConversation,
            mode: mode,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server responded with status: ${response.status}`
        );
      }

      const data = await response.json();

      setConversation((prev) => [
        ...prev,
        {
          role: "ai",
          text: data.reply,
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  const newChat = () => {
    setConversation([]);
  };

  const clearHistory = async () => {
    try {
      await fetch("http://localhost:8000/history", {
        method: "DELETE",
      });

      setConversation([]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1>Shaurya The AI Model</h1>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option value="mentor">Mentor</option>
        <option value="interviewer">AI Interviewer</option>
        <option value="coder">Coding Assistant</option>
        <option value="content-creator">content-creator</option>
        <option value="Email-genrator">Email-genrator</option>
        <option value="Linkdin-Post genrator">Linkdin-Post genrator</option>
        <option value="Instagram Caption generator">Instagram Caption Generator</option>
        <option value="Question Paper Generator">Question Paper Generator</option>
        <option value="resume-analyzer">Resume Analyzer</option>
        <option value="code-reviewer">AI Code Reviewer</option>
        <option value="bug-fixer">AI Bug Fixer</option>
        <option value="ats-checker">ATS Checker</option>
        <option value="career-roadmap">Career Roadmap Generator</option>
       <option value="project-advisor">AI Project Advisor</option>
       <option value="idea-validator">AI Startup Idea Validator</option>

      </select>

      <input
        type="text"
        placeholder="Enter Your Prompt Here.."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && sendMessage()
        }
      />

      <button
        onClick={sendMessage}
        disabled={loading}
      >
        Send
      </button>

      <button onClick={newChat}>
        New Chat
      </button>

      <button onClick={clearHistory}>
        Clear History
      </button>

      {loading && <p>Thinking...</p>}

      <h3>Conversation:</h3>

      <div>
        {conversation.map((msg, index) => (
          <div key={index}>
            <strong>
              {msg.role === "user" ? "You" : "AI"}:
            </strong>

            <p>{msg.text}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;