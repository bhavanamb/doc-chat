// API route: accepts a PDF upload and returns basic extraction info.
// Week 2 goal: verify the PDF parser works before wiring up chunking + embeddings.
//
// Request:  multipart/form-data with a single field named "file" containing a PDF.
// Response: { pageCount, preview } where preview is the first 500 chars of the full text.

import { PDFParse } from "pdf-parse";

export async function POST(req: Request) {
  // Parse the multipart form — Next.js App Router exposes this natively.
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return Response.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");

  // Validate that the field is present and is actually a file (not a plain string).
  if (!file || typeof file === "string") {
    return Response.json({ error: "No file uploaded." }, { status: 400 });
  }

  if (file.type !== "application/pdf") {
    return Response.json(
      { error: "Only PDF files are accepted." },
      { status: 415 }
    );
  }

  // Convert the browser File/Blob to a Uint8Array that pdf-parse v2 expects.
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  let textResult;
  try {
    // pdf-parse v2: instantiate with { data } then call getText().
    const parser = new PDFParse({ data });
    textResult = await parser.getText();
    await parser.destroy();
  } catch {
    return Response.json({ error: "Failed to parse PDF." }, { status: 422 });
  }

  return Response.json({
    // total is the number of pages in the PDF.
    pageCount: textResult.total,
    // First 500 characters of the full extracted text — quick sanity check.
    preview: textResult.text.slice(0, 500),
  });
}
