// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    // Server-only
    bonusApiUrl: process.env.BONUS_API_URL || "",
    bonusApiKey: process.env.BONUS_API_KEY || "",
    // Public can be read on client too (we don't need it here, but included for completeness)
    public: {
      returnParam: process.env.PUBLIC_RETURN_PARAM || "redirect"
    }
  }
})
