# Chat With Your Documents

An AI chat app built with Next.js, the Vercel AI SDK, and OpenAI.

- **Week 1** (this branch): streaming chat, no documents yet
- **Week 2** (coming): PDF upload, embeddings, Supabase pgvector RAG

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Add your OpenAI API key

```bash
cp .env.example .env.local
```

Open `.env.local` and replace `sk-replace-me` with a real key from
https://platform.openai.com/api-keys

`.env.local` is listed in `.gitignore` — it will never be committed.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the chat UI.

---

## Folder structure

```
app/
  api/chat/route.ts   ← server: streams OpenAI responses
  layout.tsx          ← root HTML shell, metadata
  page.tsx            ← client: chat UI using useChat
  globals.css         ← Tailwind base styles

components/
  ChatMessage.tsx     ← single message bubble component

lib/
  utils.ts            ← shared helpers (Week 2: PDF + embedding utils go here)

types/
  index.ts            ← shared TypeScript types

.env.example          ← template for environment variables
.env.local            ← your real keys (git-ignored)
```

---

## Stack

| Layer | Library |
|---|---|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS v4 |
| AI streaming | Vercel AI SDK (`ai` + `@ai-sdk/openai`) |
| LLM | OpenAI gpt-4o-mini |
| Database (Week 2) | Supabase + pgvector |
