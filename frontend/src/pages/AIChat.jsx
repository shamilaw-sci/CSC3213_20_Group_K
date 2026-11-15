import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AlertCircle, RefreshCw } from "lucide-react";
import { IconBrain, IconMessage, IconLogo } from "../components/icons/Icons";
import "./AIChat.css";

const SUGGESTIONS = [
  "Which career suits my profile?",
  "What skills should I learn first?",
  "How can I become a Data Scientist?",
  "Compare Software Engineer and AI/ML Engineer.",
];

const renderInlineMarkdown = (text) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }

    return part;
  });
};

function MarkdownMessage({ text }) {
  return (
    <div className="ai-markdown">
      {text.split("\n").map((line, index) => {
        if (line.startsWith("### ")) return <h4 key={index}>{renderInlineMarkdown(line.slice(4))}</h4>;
        if (line.startsWith("## ")) return <h3 key={index}>{renderInlineMarkdown(line.slice(3))}</h3>;
        if (line.startsWith("# ")) return <h2 key={index}>{renderInlineMarkdown(line.slice(2))}</h2>;
        if (/^[-*] /.test(line)) return <p className="ai-markdown-list" key={index}>• {renderInlineMarkdown(line.slice(2))}</p>;
        if (/^\d+\. /.test(line)) return <p className="ai-markdown-list" key={index}>{renderInlineMarkdown(line)}</p>;
        if (!line.trim()) return <br key={index} />;
        return <p key={index}>{renderInlineMarkdown(line)}</p>;
      })}
    </div>
  );
}

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileRequired, setProfileRequired] = useState(false);
  const [lastSubmittedMessage, setLastSubmittedMessage] = useState("");
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text = message) => {
    const trimmedMessage = text.trim();

    if (!trimmedMessage || loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    setMessages((current) => [...current, { sender: "user", text: trimmedMessage }]);
    setLastSubmittedMessage(trimmedMessage);
    setMessage("");
    setError("");
    setProfileRequired(false);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai-chat",
        { message: trimmedMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages((current) => [
        ...current,
        { sender: "ai", text: response.data?.response || "I could not generate a response. Please try again." },
      ]);
      const chatCount = Number(localStorage.getItem("aiChatCount")) || 0;
      localStorage.setItem("aiChatCount", String(chatCount + 1));
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else if (requestError.response?.status === 404) {
        setProfileRequired(true);
        setError("Please complete your profile first.");
      } else {
        setError("Unable to reach your AI Career Advisor. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [loading, message, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-page ai-chat-theme">
      <Navbar />

      <main className="ai-chat-main">
        <section className="ai-chat-header">
          <div className="ai-chat-badge"><IconBrain /> <span>Powered by Google Gemini</span></div>
          <h1>AI Career Advisor</h1>
          <p>Personalised guidance for your next career move, skills, and learning path.</p>
        </section>

        <section className="ai-chat-panel" aria-label="AI Career Advisor conversation">
          {messages.length === 0 && (
            <div className="ai-chat-welcome">
              <span className="ai-welcome-icon"><IconMessage size={36} /></span>
              <h2>How can I help shape your career?</h2>
              <p>Ask a question or choose a prompt to start a personalised conversation.</p>
            </div>
          )}

          <div className="ai-suggestions" aria-label="Suggested questions">
            {SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} type="button" disabled={loading} onClick={() => sendMessage(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>

          <div className="ai-chat-messages" aria-live="polite">
            {messages.map((chatMessage, index) => (
              <article className={`ai-message ai-message--${chatMessage.sender}`} key={`${chatMessage.sender}-${index}`}>
                {chatMessage.sender === "ai" && <div className="ai-message-avatar" aria-hidden="true"><IconLogo /></div>}
                <div className="ai-message-content">
                  {chatMessage.sender === "ai" ? <MarkdownMessage text={chatMessage.text} /> : <p>{chatMessage.text}</p>}
                </div>
              </article>
            ))}

            {loading && (
              <article className="ai-message ai-message--ai ai-thinking">
                <div className="ai-message-avatar" aria-hidden="true"><IconLogo /></div>
                <div className="ai-thinking-content"><span></span><span></span><span></span></div>
              </article>
            )}
            {error && (
              <div className="ai-chat-error" role="alert">
                <AlertCircle size={22} aria-hidden="true" />
                <div className="ai-chat-error-content">
                  <h2>{profileRequired ? "Complete your profile" : "AI service temporarily unavailable"}</h2>
                  <p>{profileRequired ? error : "We couldn't complete this request right now. Please try again in a moment."}</p>
                </div>
                {profileRequired ? (
                  <button type="button" onClick={() => navigate("/profile")}>Go to Profile</button>
                ) : (
                  <button type="button" onClick={() => sendMessage(lastSubmittedMessage)} disabled={!lastSubmittedMessage || loading}>
                    <RefreshCw size={15} aria-hidden="true" />
                    Try Again
                  </button>
                )}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form className="ai-chat-composer" onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI Career Advisor..."
              aria-label="Ask your AI Career Advisor"
              disabled={loading}
              rows="1"
            />
            <button type="submit" disabled={loading || !message.trim()} aria-label="Send message"><IconMessage /></button>
          </form>
          <p className="ai-chat-note">Enter to send · Shift + Enter for a new line</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default AIChat;
