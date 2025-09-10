// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    // Server-only
    apiBaseUrl: process.env.API_BASE_URL || "https://example.com/api",
    apiToken: process.env.API_TOKEN || "",
    // Public can be read on client too (we don't need it here, but included for completeness)
    public: {
      returnParam: process.env.PUBLIC_RETURN_PARAM || "redirect"
    }
  }
})
