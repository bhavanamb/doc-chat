import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js not to bundle these packages — let Node.js require them natively.
  // pdfjs-dist (used by pdf-parse) uses native Node.js modules that break when bundled.
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
