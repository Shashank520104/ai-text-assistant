import { useEffect, useState } from "react";
import { MODES } from "./constants/modes.js";

import {
  analyzeResume,
  clearChatHistory,
  fetchHistory,
  sendChat,
} from "./services/api.js";

import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("chat");

  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("mentor");
  const [conversation, setConversation] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [jobRole, setJobRole] = useState("");
  const [resumeResult, setResumeResult] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await fetchHistory();
        setConversation(Array.isArray(history) ? history : []);
      } catch (error) {
        console.error(error);
      }
    };

    loadHistory();
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || chatLoading) return;

    const userMessage = {
      role: "user",
      text: message.trim(),
    };

    const updatedConversation = [
      ...conversation,
      userMessage,
    ];

    setConversation(updatedConversation);
    setMessage("");
    setChatLoading(true);
    setChatError("");

    try {
      const recentConversation =
        updatedConversation.slice(-10);

      const data = await sendChat(recentConversation, mode);

      setConversation((previous) => [
        ...previous,
        {
          role: "ai",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setChatError(error.message);
    } finally {
      setChatLoading(false);
    }
  };

  const handleNewChat = () => {
    setConversation([]);
    setMessage("");
    setChatError("");
  };

  const handleClearHistory = async () => {
    try {
      await clearChatHistory();
      setConversation([]);
      setChatError("");
    } catch (error) {
      setChatError(error.message);
    }
  };

  const handleResumeAnalysis = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      setResumeError("Please select a PDF resume.");
      return;
    }

    if (!jobRole.trim()) {
      setResumeError("Please enter your target job role.");
      return;
    }

    setResumeLoading(true);
    setResumeError("");
    setResumeResult(null);

    try {
      const result = await analyzeResume(
        resumeFile,
        jobRole.trim()
      );

      setResumeResult(result);
    } catch (error) {
      setResumeError(error.message);
    } finally {
      setResumeLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">S</div>

          <div>
            <h1>Shaurya AI</h1>
            <p>AI Career Assistant</p>
          </div>
        </div>

        <nav className="navigation">
          <button
            className={
              activePage === "chat"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("chat")}
          >
            <span>✦</span>
            AI Assistant
          </button>

          <button
            className={
              activePage === "resume"
                ? "nav-button active"
                : "nav-button"
            }
            onClick={() => setActivePage("resume")}
          >
            <span>▣</span>
            Resume Analyzer
          </button>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot"></span>
          Gemini AI Connected
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI-POWERED PLATFORM</p>

            <h2>
              {activePage === "chat"
                ? "Intelligent AI Workspace"
                : "AI Resume Analyzer"}
            </h2>
          </div>

          <span className="portfolio-badge">
            Portfolio Project
          </span>
        </header>

        {activePage === "chat" ? (
          <section className="workspace">
            <div className="chat-toolbar">
              <div className="field-group">
                <label htmlFor="mode">
                  Select AI Tool
                </label>

                <select
                  id="mode"
                  value={mode}
                  onChange={(event) =>
                    setMode(event.target.value)
                  }
                >
                  {MODES
                    .filter(
                      (item) =>
                        item.value !== "resume-analyzer"
                    )
                    .map((item) => (
                      <option
                        key={item.value}
                        value={item.value}
                      >
                        {item.label}
                      </option>
                    ))}
                </select>
              </div>

              <div className="toolbar-actions">
                <button
                  className="secondary-button"
                  onClick={handleNewChat}
                >
                  New Chat
                </button>

                <button
                  className="danger-button"
                  onClick={handleClearHistory}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="chat-card">
              <div className="conversation">
                {conversation.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">✦</div>

                    <h3>How can Shaurya AI help?</h3>

                    <p>
                      Select an AI tool and begin your
                      conversation.
                    </p>
                  </div>
                )}

                {conversation.map((item, index) => (
                  <div
                    className={`message-row ${item.role}`}
                    key={`${item.role}-${index}`}
                  >
                    <div className="message-avatar">
                      {item.role === "user" ? "Y" : "S"}
                    </div>

                    <div className="message-content">
                      <span className="message-author">
                        {item.role === "user"
                          ? "You"
                          : "Shaurya AI"}
                      </span>

                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="message-row ai">
                    <div className="message-avatar">S</div>

                    <div className="message-content">
                      <span className="message-author">
                        Shaurya AI
                      </span>

                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {chatError && (
                <div className="error-message">
                  {chatError}
                </div>
              )}

              <div className="chat-input-area">
                <textarea
                  value={message}
                  placeholder="Ask Shaurya AI anything..."
                  rows="2"
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey
                    ) {
                      event.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                <button
                  className="primary-button send-button"
                  onClick={handleSendMessage}
                  disabled={chatLoading}
                >
                  {chatLoading ? "Thinking..." : "Send"}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="workspace resume-workspace">
            <div className="resume-intro">
              <p className="eyebrow">
                SMART ATS ANALYSIS
              </p>

              <h3>
                Improve your resume before applying
              </h3>

              <p>
                Upload your PDF resume and receive an ATS
                score, strengths, weaknesses, missing
                keywords, and actionable feedback.
              </p>
            </div>

            <div className="resume-grid">
              <form
                className="upload-card"
                onSubmit={handleResumeAnalysis}
              >
                <div className="upload-zone">
                  <div className="upload-icon">⇧</div>

                  <h3>Upload your resume</h3>

                  <p>PDF files only</p>

                  <input
                    id="resume-file"
                    type="file"
                    accept="application/pdf"
                    onChange={(event) => {
                      setResumeFile(
                        event.target.files?.[0] || null
                      );
                      setResumeError("");
                    }}
                  />

                  <label
                    htmlFor="resume-file"
                    className="file-button"
                  >
                    Choose PDF
                  </label>

                  {resumeFile && (
                    <p className="selected-file">
                      {resumeFile.name}
                    </p>
                  )}
                </div>

                <div className="field-group">
                  <label htmlFor="job-role">
                    Target Job Role
                  </label>

                  <input
                    id="job-role"
                    type="text"
                    placeholder="Example: AI Full Stack Developer"
                    value={jobRole}
                    onChange={(event) =>
                      setJobRole(event.target.value)
                    }
                  />
                </div>

                {resumeError && (
                  <div className="error-message">
                    {resumeError}
                  </div>
                )}

                <button
                  className="primary-button analyze-button"
                  type="submit"
                  disabled={resumeLoading}
                >
                  {resumeLoading
                    ? "Analyzing Resume..."
                    : "Analyze Resume"}
                </button>
              </form>

              <div className="results-panel">
                {!resumeResult && !resumeLoading && (
                  <div className="empty-result">
                    <div className="empty-icon">◎</div>

                    <h3>Your analysis will appear here</h3>

                    <p>
                      Upload a resume and choose your target
                      role to begin.
                    </p>
                  </div>
                )}

                {resumeLoading && (
                  <div className="analysis-loader">
                    <div className="spinner"></div>

                    <h3>Analyzing your resume</h3>

                    <p>
                      Shaurya AI is extracting skills and
                      evaluating ATS compatibility.
                    </p>
                  </div>
                )}

                {resumeResult && (
                  <div className="results-content">
                    <div className="score-card">
                      <div
                        className="score-ring"
                        style={{
                          "--score":
                            resumeResult.ats_score || 0,
                        }}
                      >
                        <span>
                          {resumeResult.ats_score || 0}
                        </span>

                        <small>/100</small>
                      </div>

                      <div>
                        <p className="result-label">
                          ATS SCORE
                        </p>

                        <h3>
                          {resumeResult.verdict ||
                            "Analysis Complete"}
                        </h3>
                      </div>
                    </div>

                    <ResultCard
                      title="Strengths"
                      items={resumeResult.strengths}
                      type="positive"
                    />

                    <ResultCard
                      title="Weaknesses"
                      items={resumeResult.weaknesses}
                      type="negative"
                    />

                    <ResultCard
                      title="Missing Keywords"
                      items={resumeResult.missing_keywords}
                      type="keyword"
                    />

                    <div className="tip-card">
                      <p className="result-label">
                        IMPROVEMENT TIP
                      </p>

                      <p>
                        {resumeResult.improvement_tip ||
                          "No improvement tip was provided."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function ResultCard({ title, items = [], type }) {
  return (
    <div className={`result-card ${type}`}>
      <h4>{title}</h4>

      {items.length > 0 ? (
        <ul>
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>No items available.</p>
      )}
    </div>
  );
}

export default App;