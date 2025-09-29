import { defineEventHandler, getRequestURL, getHeader, sendRedirect, setResponseHeader } from "h3";

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const username = url.searchParams.get("username");
  if (!username) {
    return;
  }

  // Only run this middleware on a dedicated path, avoid hijacking home page with query params
  if (url.pathname !== "/redirect") {
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

  // Decide redirect target: prefer explicit redirect query (PUBLIC_RETURN_PARAM), then referrer; else, same URL without username
  const publicConfig = useRuntimeConfig(event).public;
  const returnParam = publicConfig?.returnParam || "redirect";
  const redirectFromQuery = url.searchParams.get(returnParam) || "";

  let redirectTarget = redirectFromQuery || referrer;
  if (!redirectTarget) {
    const newUrl = new URL(url.toString());
    newUrl.searchParams.delete("username");
    if (returnParam) newUrl.searchParams.delete(returnParam);
    redirectTarget = newUrl.toString();
  }

  // Prevent caching of redirect responses
  setResponseHeader(event, "Cache-Control", "no-store, max-age=0");
  return sendRedirect(event, redirectTarget, 302);
});


