"use client"; // This page runs in the browser (uses React hooks)

// AI SDK v7: useChat lives in @ai-sdk/react (separate package from "ai").
import { useChat } from "@ai-sdk/react";
import { useState, useEffect, useRef } from "react";
import ChatMessage from "@/components/ChatMessage";

export default function ChatPage() {
  const {
    messages, // UIMessage[] — the full conversation history
    sendMessage, // (msg: { text: string }) => void — sends a message
    status, // "ready" | "submitted" | "streaming" | "error"
    stop, // () => void — cancels an in-progress stream
    error, // Error | undefined — set when the API call fails
  } = useChat();
  // useChat() defaults to posting to /api/chat with no extra config needed.

  // AI SDK v7 no longer manages the input field — we do it ourselves.
  const [input, setInput] = useState("");

  // "submitted" = waiting for first token; "streaming" = tokens arriving
  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to the bottom whenever a new message arrives
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input }); // send to the API
    setInput(""); // clear the input field
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* ── Header ── */}
      <header className="border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <h1 className="text-lg font-semibold text-gray-900">
          Chat With Your Documents
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Week 1 — streaming chat (documents coming in Week 2)
        </p>
      </header>

      {/* ── Message list ── */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-16">
            Ask me anything. In Week 2 you&apos;ll be able to upload PDFs and
            ask questions about them.
          </p>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Loading indicator — three bouncing dots while waiting for the first token */}
        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-2">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="text-center text-red-500 text-sm my-4 p-3 bg-red-50 rounded-lg">
            Error: {error.message}
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* ── Input area ── */}
      <footer className="border-t border-gray-200 px-4 py-4 flex-shrink-0">
        <form onSubmit={handleSend} className="flex gap-2 max-w-3xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question…"
            disabled={isLoading}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-gray-900
                       disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Show Stop button while streaming, Send button otherwise */}
          {isLoading ? (
            <button
              type="button"
              onClick={stop}
              className="px-4 py-2 rounded-xl text-sm font-medium
                         bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-4 py-2 rounded-xl text-sm font-medium
                         bg-gray-900 text-white hover:bg-gray-700 transition-colors
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Send
            </button>
          )}
        </form>
      </footer>
    </div>
  );
}
