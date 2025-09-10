import { defineEventHandler, getRequestURL, getHeader, sendRedirect, readBody, setResponseHeader } from "h3";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const username = url.searchParams.get("username");
  if (!username) {
    return;
  }

  // Capture referrer from header if any
  const referrer = getHeader(event, "referer") || getHeader(event, "referrer") || "";

  // Call internal server API (no client involved)
  try {
    // Use local fetch bound to same server instance
    await $fetch("/api/username", {
      method: "POST",
      body: {
        username,
        referrer,
        path: url.pathname,
        query: Object.fromEntries(url.searchParams.entries()),
      },
    });
  } catch {
    // Ignore errors; redirect regardless
  }

  // Decide redirect target: prefer referrer; else, same URL without username
  let redirectTarget = referrer;
  if (!redirectTarget) {
    const newUrl = new URL(url.toString());
    newUrl.searchParams.delete("username");
    redirectTarget = newUrl.toString();
  }

  // Prevent caching of redirect responses
  setResponseHeader(event, "Cache-Control", "no-store, max-age=0");
  return sendRedirect(event, redirectTarget, 302);
});


