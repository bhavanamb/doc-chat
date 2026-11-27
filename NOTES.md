# Learning Notes — Chat With Your Documents

> Written for a React/JS developer learning Next.js and agentic UI.
> Each concept is explained through the lens of what you already know.

---

## 1. Next.js App Router — React, but with a file system router

You already know React Router or similar. Next.js App Router replaces that.
Every folder inside `app/` that contains a `page.tsx` becomes a URL.

```
app/page.tsx          →  /
app/upload/page.tsx   →  /upload
```

That's it. No `<Route>` components, no router config.

### Server Components vs Client Components

This is the biggest mental shift. In plain React, **every component runs in the browser**.
In Next.js App Router, **every component is a Server Component by default** — it runs on
the server, like a template engine. It can fetch data, read env vars, talk to databases.
It never ships its JS to the browser.

Add `"use client"` at the top of a file to opt that component back into the browser
(React hooks, event handlers, useState — anything interactive needs it).

```
// Server Component — no "use client", runs only on the server
// Can: read env vars, query a DB, fetch data at render time
// Cannot: useState, useEffect, onClick

// Client Component — has "use client"
// Can: useState, useEffect, onClick, useChat
// Cannot: read server env vars directly (SUPABASE_SERVICE_ROLE_KEY would leak!)
```

In this project: `app/page.tsx` and `app/upload/page.tsx` are both `"use client"` because
they use React hooks and handle user interaction.

---

## 2. API Routes — Express endpoints inside Next.js

In a React app you'd have a separate Express or Node server.
In Next.js, `app/api/*/route.ts` files ARE that server.

```
app/api/chat/route.ts    →  POST /api/chat
app/api/upload/route.ts  →  POST /api/upload
```

Each file exports named functions matching HTTP methods:

```ts
export async function POST(req: Request) { ... }
export async function GET(req: Request) { ... }
```

The `req` is a standard Web API `Request` object (same as `fetch`'s request),
and you return a standard `Response`. No `express`, no `res.json()`.

```ts
// Express style (what you know):
res.json({ message: "hello" })

// Next.js App Router style:
return Response.json({ message: "hello" })
```

**Important:** these routes run on the server. They can safely read
`process.env.SUPABASE_SERVICE_ROLE_KEY` — it never goes to the browser.

---

## 3. Agentic UI — what it means and why it matters

"Agentic UI" = a UI that talks to an AI model and updates in real-time as the
model generates output. The key ingredient is **streaming**.

### Why streaming?

GPT-4o-mini can take 5–10 seconds to finish a response. Without streaming you'd
show a spinner for 10 seconds, then dump the whole text at once. With streaming
you show each word/token as it arrives — the UI feels instant.

### The Vercel AI SDK streaming model (v7)

```
Browser                     Server (route.ts)              OpenAI
  │                              │                            │
  │── POST /api/chat ───────────▶│                            │
  │   { messages: [...] }        │── streamText() ───────────▶│
  │                              │◀── token token token ──────│
  │◀── SSE stream ───────────────│                            │
  │  (token by token)            │                            │
```

SSE = Server-Sent Events. It's a one-way stream from server to browser over HTTP.
The AI SDK handles all of this for you on both sides.

**Server side** (`app/api/chat/route.ts`):
```ts
const result = streamText({ model, messages });
return result.toUIMessageStreamResponse(); // opens the SSE stream
```

**Client side** (`app/page.tsx`):
```ts
const { messages, sendMessage, status, stop } = useChat();
// messages updates token-by-token as the stream arrives
// status: "ready" | "submitted" | "streaming" | "error"
```

`useChat` is roughly equivalent to a `useState` + `useEffect` + `fetch` combo
that you'd write yourself — except it handles streaming, retries, and message
history automatically.

---

## 4. AI SDK v7 — how messages work

**v3/v4** (older, most tutorials use this): messages had a simple `content: string`.
**v7** (what this project uses): messages have `parts: Part[]` instead.

A `UIMessage` looks like this:

```ts
{
  id: "abc123",
  role: "user" | "assistant",
  parts: [
    { type: "text", text: "What is React?" },
    // future: { type: "file", ... }, { type: "tool-call", ... }
  ]
}
```

The `parts` model exists so messages can contain text, files, reasoning steps, and
tool calls all in one message. For Week 1–2 you only use text parts.

In `components/ChatMessage.tsx`, that's why you see:
```ts
const text = message.parts.filter(isTextUIPart).map(p => p.text).join("");
```

---

## 5. The RAG pipeline — where this project is headed

**RAG = Retrieval-Augmented Generation**. Instead of asking the AI a question cold,
you first search your own documents for relevant passages, then give those passages
to the AI as context.

The pipeline this app will build, week by week:

```
Week 2 (done):   Upload PDF → extract text page by page
Week 3 (next):   Split text into chunks → embed each chunk → store in Supabase
Week 4:          At chat time → embed the question → find similar chunks → inject into prompt
```

### Why pgvector?

Supabase's pgvector extension lets PostgreSQL store and search **embedding vectors**.
An embedding is an array of 1536 numbers that represents the meaning of a piece of text.
Similar text → similar numbers → similar vectors.

```
"What is React?" → [0.02, -0.14, 0.87, ...] (1536 floats)
"React is a UI library" → [0.03, -0.13, 0.85, ...] (very similar!)
"My cat is orange" → [-0.42, 0.91, 0.03, ...] (very different)
```

pgvector's `<=>` operator does a cosine similarity search over millions of vectors in
milliseconds, finding the chunks most relevant to the user's question.

---

## 6. Key files at a glance

| File | What it does | Runs on |
|------|-------------|---------|
| `app/page.tsx` | Chat UI, `useChat` hook | Browser |
| `app/upload/page.tsx` | PDF upload form | Browser |
| `app/api/chat/route.ts` | Streams OpenAI responses | Server |
| `app/api/upload/route.ts` | Parses PDF, returns text | Server |
| `lib/supabase.ts` | Supabase client (service role) | Server only |
| `lib/chunking.ts` | Splits text into chunks (TODO) | Server |
| `lib/embeddings.ts` | Calls OpenAI embeddings (TODO) | Server |
| `supabase/schema.sql` | DB schema — run in SQL editor | Supabase |
| `components/ChatMessage.tsx` | Single message bubble | Browser |
| `types/index.ts` | Shared TypeScript types | Both |

---

## 7. Environment variables — why two kinds

```
OPENAI_API_KEY          ← server only (no NEXT_PUBLIC_ prefix)
SUPABASE_URL            ← server only
SUPABASE_SERVICE_ROLE_KEY ← server only, NEVER expose
```

Next.js only ships env vars to the browser if they start with `NEXT_PUBLIC_`.
Everything else stays on the server. This is why `lib/supabase.ts` reads
`process.env.SUPABASE_SERVICE_ROLE_KEY` safely — that file is only ever
imported in API routes, never in a `"use client"` component.

If you ever accidentally import a server-only file in a client component,
Next.js will throw a build error. Good — it's protecting your secrets.

---

## 8. Things that tripped us up (and why)

**pdf-parse v2 needed `serverExternalPackages`** — Next.js's bundler tried to
webpack-compile pdfjs-dist (which pdf-parse uses internally), breaking its native
Node.js modules. Adding it to `serverExternalPackages` in `next.config.ts` tells
Next.js to leave it alone and let Node.js require it directly.

**AI SDK v7 has no `handleSubmit` or `input`** — Older tutorials show:
```ts
const { input, handleInputChange, handleSubmit } = useChat()
```
In v7 you manage the input yourself with `useState` and call `sendMessage({ text })`.
The hook only manages AI state (messages, streaming status, errors).

**`toDataStreamResponse()` was renamed** — v7 uses `toUIMessageStreamResponse()`.
The stream format also changed from a simple text stream to a JSON event stream so
the client can receive structured data (tool calls, file parts, etc.) in the future.
