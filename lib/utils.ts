// General-purpose utility functions.
// Week 2: add PDF parsing helpers, embedding calls, and Supabase
// vector-search helpers here.

/** Joins class names, filtering out falsy values. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
