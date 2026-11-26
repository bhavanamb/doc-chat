// Embedding generation — calls OpenAI to turn text chunks into vectors.

// TODO: implement embedChunks
//
// Inputs:
//   chunks: { text: string; pageNumber: number }[]
//     — the chunks produced by chunkText() in lib/chunking.ts
//
// Output:
//   Promise<{ text: string; pageNumber: number; embedding: number[] }[]>
//     — the same chunks, each enriched with its 1536-dimensional embedding
//       ready to be stored in the `chunks` table (embedding vector(1536)).
//
// Suggested approach:
//   1. Import `openai` from "@ai-sdk/openai" and `embedMany` from "ai".
//   2. Call embedMany({ model: openai.embedding("text-embedding-3-small"), values: ... })
//      with the array of chunk texts.
//   3. Zip the returned embeddings back onto the original chunks.
//   4. Consider batching if the document is large (OpenAI has a token limit per request).
export async function embedChunks(
  _chunks: { text: string; pageNumber: number }[]
): Promise<{ text: string; pageNumber: number; embedding: number[] }[]> {
  // TODO: implement
  return [];
}
