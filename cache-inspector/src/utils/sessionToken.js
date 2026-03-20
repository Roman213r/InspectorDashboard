const TOKEN_STORAGE_KEY = 'cache_token'

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function generateTokenHex64() {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return bytesToHex(bytes)
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function getSessionTokenPayload() {
  const raw = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (!raw) return null

  const parsed = safeJsonParse(raw)
  if (!parsed || typeof parsed !== 'object') return null

  const { token, createdAt } = parsed
  if (typeof token !== 'string' || token.length !== 64) return null
  if (typeof createdAt !== 'number' || !Number.isFinite(createdAt)) return null

  return { token, createdAt }
}

export function ensureSessionToken() {
  const existing = getSessionTokenPayload()
  if (existing) return existing

  const payload = {
    token: generateTokenHex64(),
    createdAt: Date.now(),
  }
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(payload))
  return payload
}

export function getSessionTokenStorageKey() {
  return TOKEN_STORAGE_KEY
}

