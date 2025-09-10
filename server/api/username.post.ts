import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username?: string;
    referrer?: string;
    path?: string;
    query?: Record<string, string>;
  }>(event);

  const username = body?.username || "";

  // Simulate calling an external API with the username
  // Replace this with your real API call logic
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Example response
  return {
    ok: true,
    username,
    received: body,
    at: new Date().toISOString(),
  };
});


