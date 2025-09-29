import { H3Event, getRequestHeader, readBody } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<{ username: string; bonusId: number; campaignId: number | null }>(event)

    const clientIp =
      getRequestHeader(event, 'cf-connecting-ip') ||
      getRequestHeader(event, 'x-forwarded-for') ||
      getRequestHeader(event, 'x-real-ip') ||
      ''

    const config = useRuntimeConfig(event)
    const url = config.bonusApiUrl
    const apiKey = config.bonusApiKey

    if (!apiKey) {
      return { ok: false, error: 'Server is missing BONUS_API_KEY', status: 500 }
    }

    // Basic origin check (adjust allowed origins as needed)
    const origin = getRequestHeader(event, 'origin') || ''
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
    if (allowedOrigins.length && origin && !allowedOrigins.includes(origin)) {
      return { ok: false, error: 'Origin not allowed', status: 403 }
    }

    // Simple in-memory rate limit per IP (dev-safe; replace with persistent store for prod)
    // Allow 10 requests per 60s per IP
    const ipKey = `rl:${clientIp}`
    // @ts-ignore - attach store to globalThis
    const store: Map<string, { count: number; ts: number }> = (globalThis as any).__rateStore || new Map()
    // @ts-ignore
    if (!(globalThis as any).__rateStore) (globalThis as any).__rateStore = store
    const now = Date.now()
    const windowMs = 60_000
    const limit = 10
    const rec = store.get(ipKey)
    if (!rec || now - rec.ts > windowMs) {
      store.set(ipKey, { count: 1, ts: now })
    } else {
      if (rec.count >= limit) {
        return { ok: false, error: 'Too many requests, try again later', status: 429 }
      }
      rec.count += 1
    }

    // Server-side logs for debug
    console.log('[BonusRequest] outbound body', {
      username: body?.username,
      bonusId: body?.bonusId,
      campaignId: null,
      ipAdress: clientIp
    })

    const response = await $fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Asist-Server-API',
        'X-API-KEY': apiKey,
        'X-Asist-Info': clientIp || ''
      },
      body: {
        username: body?.username || '',
        bonusId: body?.bonusId ?? 0,
        ipAdress: clientIp || '',
        campaignId: null
      }
    })

    console.log('[BonusRequest] response', response)
    return { ok: true, data: response }
  } catch (error: any) {
    const status = error?.status || error?.response?.status || 500
    const message = error?.data?.message || error?.data || error?.statusMessage || error?.message || 'Unknown error'
    console.error('[BonusRequest] error', { status, message })
    // Always return 200 with structured error to avoid client fetch throwing as network error
    return { ok: false, error: message, status }
  }
})


