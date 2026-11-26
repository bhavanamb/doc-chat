// Server-side API route that handles chat requests.
// Receives the conversation history from the client and streams
// a response back from OpenAI using the Vercel AI SDK v7.

import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

// Allow streaming responses up to 30 seconds (Vercel default is 10s)
export const maxDuration = 30;

export async function POST(req: Request) {
  // AI SDK v7: the client sends { messages } where messages is UIMessage[].
  // We use convertToModelMessages() to translate them into the format
  // that streamText / OpenAI expects (role + content arrays).
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o-mini"),
    // System prompt — Week 2: inject retrieved document chunks here.
    system:
      "You are a helpful assistant. In a future version of this app you will answer questions about the user's uploaded documents. For now, answer general questions helpfully and concisely.",
    messages: await convertToModelMessages(messages),
  });

  // toUIMessageStreamResponse() returns the response in the JSON event-stream
  // format that the AI SDK's useChat hook (DefaultChatTransport) expects.
  return result.toUIMessageStreamResponse();
}
