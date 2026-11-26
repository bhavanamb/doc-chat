// Renders a single chat message bubble.
// User messages appear on the right; assistant messages on the left.

import { isTextUIPart } from "ai";
import type { UIMessage } from "@/types";

interface ChatMessageProps {
  message: UIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  // AI SDK v7: message content lives in `parts`, not a top-level `content` string.
  // We filter for text parts and join them. During streaming, parts grow in real-time.
  const text = message.parts
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join("");

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed
          ${
            isUser
              ? "bg-gray-900 text-white rounded-br-sm"
              : "bg-gray-100 text-gray-900 rounded-bl-sm"
          }`}
      >
        {text}
      </div>
    </div>
  );
}
