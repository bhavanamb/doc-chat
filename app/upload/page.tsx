"use client";

// Upload page — Week 2 test harness.
// Sends a PDF to /api/upload and shows the page count + text preview.
// Week 3: this will trigger the full chunking → embedding → Supabase pipeline.

import { useState } from "react";

type UploadResult = {
  pageCount: number;
  preview: string;
} | null;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<UploadResult>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error — is the dev server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">
        Upload a Document
      </h1>
      <p className="text-sm text-gray-400 mb-8">
        Week 2 — PDF extraction test. Full ingestion pipeline coming in Week 3.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File picker */}
        <label className="block">
          <span className="text-sm font-medium text-gray-700">PDF file</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                       file:text-sm file:font-medium file:bg-gray-900 file:text-white
                       hover:file:bg-gray-700 cursor-pointer"
          />
        </label>

        <button
          type="submit"
          disabled={!file || loading}
          className="px-5 py-2 rounded-xl text-sm font-medium bg-gray-900 text-white
                     hover:bg-gray-700 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Parsing…" : "Upload & Parse"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Pages detected:</span> {result.pageCount}
          </p>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Text preview (first 500 chars):
            </p>
            {/* whitespace-pre-wrap preserves line breaks from the PDF extraction */}
            <pre className="text-xs text-gray-600 bg-gray-50 rounded-xl p-4
                            whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
              {result.preview}
            </pre>
          </div>
        </div>
      )}

      {/* Nav back to chat */}
      <a
        href="/"
        className="inline-block mt-10 text-sm text-gray-400 hover:text-gray-700 underline"
      >
        ← Back to chat
      </a>
    </div>
  );
}
