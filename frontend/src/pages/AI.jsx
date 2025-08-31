import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import MobileSidebar from "../components/MobileSidebar";

import { getSocket } from "../services/socket";

const STORAGE_KEY = "pv_ai_chat_history_v1";

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const AI = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(loadHistory()); // [{role:'user'|'assistant', content:string}]
  const [connecting, setConnecting] = useState(true);

  const inputRef = useRef(null);
  const endRef = useRef(null);

  // Persist chat to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Socket wiring
  useEffect(() => {
    const socket = getSocket();

    function onConnect() {
      setConnecting(false);
    }
    function onDisconnect() {
      setConnecting(true);
    }
    function onAiResponse(payload) {
      const text = typeof payload === "string" ? payload : JSON.stringify(payload);
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
      // Scroll to bottom on new message
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    }
    function onAiError(err) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${err}` }]);
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("ai-response", onAiResponse);
    socket.on("ai-error", onAiError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("ai-response", onAiResponse);
      socket.off("ai-error", onAiError);
    };
  }, []);

  function send() {
    const text = message.trim();
    if (!text) return;
    // 1) Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    // 2) Clear input immediately
    setMessage("");
    // 3) Emit to backend
    const socket = getSocket();
    socket.emit("ai-message", text);
    // 4) Keep focus, and scroll down
    inputRef.current?.focus();
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function clearChat() {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  return (
    <div className="min-h-screen app-bg app-container">
      <Navbar />
      <MobileSidebar />

      <div className="w-full p-2 md:p-3">
        <div className="mx-auto max-w-5xl md:h-[calc(100vh-100px)] h-[calc(100vh-80px)] flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-purple-600 dark:text-purple-400 text-center md:text-left">
              Your AI Buddy ֎
            </h2>
            <div className="flex justify-center md:justify-end">
              <button
                onClick={clearChat}
                className=" cursor-pointer px-3 md:px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm md:text-base transition"
                title="Clear all chat messages"
              >
                Clear chat
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 rounded-xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-4 md:p-6 overflow-auto">
            {connecting && (
              <div className="text-center text-gray-500 dark:text-gray-400 mb-2">Connecting to AI...</div>
            )}

            {messages.length === 0 && !connecting ? (
              <div className="h-full flex items-center justify-center text-center text-gray-600 dark:text-gray-300">
                <div>
                  <p className="text-lg">Your AI response will appear here</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start by typing a prompt below</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[90%] md:max-w-[85%] bg-purple-600/90 text-white px-4 py-2 rounded-2xl rounded-br-sm"
                          : "max-w-[90%] md:max-w-[85%] bg-gray-100 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm"
                      }
                    >
                      <pre className="whitespace-pre-wrap break-words">{m.content}</pre>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="mt-3 md:mt-4">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Enter your prompt..."
                className="flex-1 px-3 md:px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                required
              />
              <button
                onClick={send}
                className="cursor-pointer hover:scale-96 px-3 md:px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition text-white font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default AI;