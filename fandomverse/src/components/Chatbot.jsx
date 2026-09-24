import { useState, useRef, useEffect } from "react";
import chatbotData from "../data/chatbotRules.json";
import "./Chatbot.css";


let idCounter = 0;
const makeId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  idCounter += 1;
  return `msg-${Date.now()}-${idCounter}`;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  // True while the bot is "thinking" — shows the bouncing dots bubble
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "initial-msg",
      sender: "bot",
      text: "Welcome to FandomVerse! How can I help you explore today?",
      linkText: null,
      linkUrl: null,
    },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // How many replies are still in flight, and the timers behind them.
  // Without the counter, sending twice quickly clears the typing dots as
  // soon as the first reply lands, while the second is still pending.
  const pendingRef = useRef(0);
  const timersRef = useRef(new Set());

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // Put the cursor in the text box as soon as the panel opens
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Let the Esc key close the panel, like a real modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Cancel any in-flight replies if the widget unmounts mid-thought
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, []);

  // Evaluates the user's query against the JSON knowledge base.
  //
  // There are two kinds of rule in chatbotRules.json:
  //   - topic rules  — what the visitor is asking about ("gaming", "gojo")
  //   - intent rules — what they want done with it ("recommend", "suggest").
  //     These carry an `intent` field and never win the topic on their own.
  //
  // Keeping the two apart is what makes "recommend a game" work. Scored as one
  // pool, the word "recommend" (9 letters) outscores "game" (4), so every
  // request for a recommendation collapsed into the same generic answer.
  const processQuery = (userInput) => {
    const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const scoreRule = (rule) =>
      rule.keywords.reduce((score, keyword) => {
        // \b marks a word boundary, so "show" won't match inside "showcase"
        const pattern = new RegExp(`\\b${escapeRegex(keyword)}\\b`, "i");
        // Longer keywords are more specific, so they're worth more points
        return pattern.test(userInput) ? score + keyword.length : score;
      }, 0);

    // Pass 1 — find the best topic, and whether any intent rule fires.
    let bestTopic = null;
    let bestScore = 0;
    let intentRule = null;

    for (const rule of chatbotData.rules) {
      const score = scoreRule(rule);

      if (rule.intent) {
        if (score > 0 && !intentRule) intentRule = rule;
        continue;
      }

      // On a tie the FIRST rule listed wins — "anime movie" scores identically
      // on the anime and movies rules. Rule order is load-bearing, and the
      // routing test in scripts/test-chatbot-routing.mjs pins the behaviour.
      if (score > bestScore) {
        bestScore = score;
        bestTopic = rule;
      }
    }

    // Pass 2 — decide what to say.
    if (bestTopic) {
      // "recommend a game" gets gaming's `featured` pick; a plain "game"
      // question gets the hub blurb instead.
      const usePick = Boolean(intentRule && bestTopic.featured);
      return {
        text: usePick ? bestTopic.featured.text : bestTopic.response,
        linkText: usePick ? bestTopic.featured.linkText : bestTopic.linkText,
        linkUrl: usePick ? bestTopic.featured.linkUrl : bestTopic.linkUrl,
      };
    }

    // Nothing topical matched, but they did ask for a recommendation
    if (intentRule) {
      return {
        text: intentRule.response,
        linkText: intentRule.linkText,
        linkUrl: intentRule.linkUrl,
      };
    }

    return {
      text: chatbotData.defaultResponse,
      linkText: null,
      linkUrl: null,
    };
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add user message using a unique string ID
    const userMsg = {
      id: makeId(),
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");

    // Show the typing dots, then swap them for the bot's reply. The counter
    // keeps them up until the LAST pending reply lands.
    pendingRef.current += 1;
    setIsTyping(true);

    const timer = setTimeout(() => {
      timersRef.current.delete(timer);

      const botResult = processQuery(query);
      const botMsg = {
        id: makeId(),
        sender: "bot",
        text: botResult.text,
        linkText: botResult.linkText,
        linkUrl: botResult.linkUrl,
      };
      setMessages((prev) => [...prev, botMsg]);

      pendingRef.current -= 1;
      setIsTyping(pendingRef.current > 0);
    }, 600);

    timersRef.current.add(timer);
  };

  return (
    /* `is-open` on the wrapper drives the panel's open/close animation */
    <div className={`chatbot-wrapper ${isOpen ? "is-open" : ""}`}>
      {/* Floating Toggle Button */}
      <button
        type="button"
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          /* Close icon (an X) */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          /* Chat bubble icon */
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z" />
          </svg>
        )}
      </button>

      {/* Chat Window Panel — always rendered so it can animate closed too */}
      <div className="chatbot-panel" aria-hidden={!isOpen}>
        <div className="chatbot-header">
          <span className="bot-status-dot"></span>
          <div className="chatbot-header-text">
            <h4>FandomVerse Assistant</h4>
          </div>
          <button
            type="button"
            className="chatbot-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="chatbot-messages" role="log" aria-live="polite">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
              <p>{msg.text}</p>
              {msg.linkUrl && (
                <a href={msg.linkUrl} className="chatbot-recommendation-link">
                  {msg.linkText} →
                </a>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="chat-bubble bot typing-dots" aria-label="Assistant is typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Reply Prompts */}
        <div className="chatbot-quick-replies">
          {chatbotData.quickReplies.map((qr, idx) => (
            <button
              type="button"
              key={idx}
              className="quick-reply-btn"
              onClick={() => handleSendMessage(qr.trigger)}
            >
              {qr.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          className="chatbot-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a question or category..."
            aria-label="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" aria-label="Send message" disabled={!input.trim()}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
