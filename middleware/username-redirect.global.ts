export default defineNuxtRouteMiddleware(async (to) => {
  // Run only on client where document.referrer is available
  if (!import.meta.client) {
    return;
  }

  const usernameParam = to.query.username;
  const username = Array.isArray(usernameParam) ? usernameParam[0] : usernameParam;
  if (!username) {
    return;
  }

  // Avoid re-triggering if we've already handled this URL in this session
  const handledKey = `handled-username:${username}`;
  try {
    if (sessionStorage.getItem(handledKey)) {
      return;
    }
  } catch {}

  // Capture referrer on client
  const referrer = document.referrer || "";

  // Call internal API and wait for completion (success or failure)
  try {
    await $fetch("/api/username", {
      method: "POST",
      body: {
        username,
        referrer,
        path: window.location.pathname,
        query: Object.fromEntries(new URLSearchParams(window.location.search)),
      },
    });
  } catch {
    // Intentionally ignore errors; we still redirect afterwards
  }

  try {
    sessionStorage.setItem(handledKey, "1");
  } catch {}

  // Redirect back to the referrer if available; otherwise, remove the username query and stay
  if (referrer) {
    window.location.replace(referrer);
    return abortNavigation();
  }

  // Fallback: remove username from URL to prevent repeated handling
  const url = new URL(window.location.href);
  url.searchParams.delete("username");
  window.location.replace(url.toString());
  return abortNavigation();
});


