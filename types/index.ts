// Central place for shared TypeScript types.
// Week 2: add Document, Chunk, Embedding types here.

// In AI SDK v7, the message type displayed in the UI is UIMessage.
// Re-exporting from one place keeps the rest of the app decoupled from "ai".
export type { UIMessage } from "ai";
