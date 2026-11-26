// Text chunking — splits extracted PDF text into overlapping chunks
// that are small enough to embed and retrieve accurately.

// TODO: implement chunkText
//
// Inputs:
//   pages: { text: string; pageNumber: number }[]
//     — array of pages returned by the PDF parser, each with its raw text
//       and 1-based page number.
//   options?: { chunkSize?: number; overlap?: number }
//     — chunkSize: target character count per chunk (default ~1000)
//     — overlap: how many characters to repeat at the start of the next
//       chunk so context isn't lost at boundaries (default ~200)
//
// Output:
//   { text: string; pageNumber: number }[]
//     — array of chunks, each carrying the page it came from so we can
//       show the user which page a retrieved answer came from.
//
// Suggested approach:
//   1. Loop over each page's text.
//   2. Slide a window of `chunkSize` characters, stepping by (chunkSize - overlap).
//   3. Trim whitespace and skip empty chunks.
export function chunkText(
  _pages: { text: string; pageNumber: number }[],
  _options?: { chunkSize?: number; overlap?: number }
): { text: string; pageNumber: number }[] {
  // TODO: implement
  return [];
}
