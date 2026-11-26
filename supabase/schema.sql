-- Run this once in the Supabase SQL editor to set up the schema.
-- Safe to re-run: CREATE IF NOT EXISTS / CREATE EXTENSION IF NOT EXISTS.

-- 1. Enable the pgvector extension so we can store and search embeddings.
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. documents: one row per uploaded PDF file.
CREATE TABLE IF NOT EXISTS documents (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name   text        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 3. chunks: one row per text chunk extracted from a document.
--    embedding is a 1536-dimensional vector (OpenAI text-embedding-3-small output size).
CREATE TABLE IF NOT EXISTS chunks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid        NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  content     text        NOT NULL,
  page_number integer,
  embedding   vector(1536)
);

-- Index for fast cosine-similarity search over embeddings (Week 3+).
-- ivfflat requires at least some rows before it's useful; create it now so it's ready.
CREATE INDEX IF NOT EXISTS chunks_embedding_idx
  ON chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
