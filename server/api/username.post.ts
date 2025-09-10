import { defineEventHandler, readBody } from "h3";

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    username?: string;
    referrer?: string;
    path?: string;
    query?: Record<string, string>;
  }>(event);

  const username = body?.username || "";

  // Use secure runtime config (server-only)
  const config = useRuntimeConfig(event);
  const apiBaseUrl = config.apiBaseUrl;
  const apiToken = config.apiToken;

  // Simulated external API call using config; replace later with real fetch
  await new Promise((resolve) => setTimeout(resolve, 300));
  const simulatedResponse = {
    success: true,
    username,
    provider: apiBaseUrl,
  };

  return {
    ok: simulatedResponse.success,
    username,
    received: body,
    provider: simulatedResponse.provider,
    at: new Date().toISOString(),
  };
});


