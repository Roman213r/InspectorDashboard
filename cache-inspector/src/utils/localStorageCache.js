import {
  ensureSessionToken,
  getSessionTokenPayload,
  getSessionTokenStorageKey,
} from './sessionToken.js'

const META_STORAGE_KEY = 'cache_inspector_meta'

function safeJsonParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function getMetaMap() {
  const raw = localStorage.getItem(META_STORAGE_KEY)
  if (!raw) return {}
  const parsed = safeJsonParse(raw)
  if (!parsed || typeof parsed !== 'object') return {}
  return parsed
}

function setMetaMap(nextMap) {
  localStorage.setItem(META_STORAGE_KEY, JSON.stringify(nextMap))
}

export function setCacheItem(key, value) {
  const timestamp = Date.now()

  const nextValue =
    typeof value === 'string' ? value : JSON.stringify(value, null, 0)

  localStorage.setItem(key, nextValue)

  const meta = getMetaMap()
  meta[key] = timestamp
  meta[META_STORAGE_KEY] = timestamp
  setMetaMap(meta)

  return timestamp
}

function formatStoredValue(value) {
  const max = 180
  if (value == null) return ''
  if (typeof value !== 'string') value = String(value)

  if (value.length > max) {
    return value.slice(0, max) + '…'
  }
  return value
}

function getRecordedAtForKey(key) {
  if (key === getSessionTokenStorageKey()) {
    const tokenPayload = getSessionTokenPayload()
    return tokenPayload?.createdAt ?? null
  }

  const meta = getMetaMap()
  const ts = meta[key]
  return typeof ts === 'number' && Number.isFinite(ts) ? ts : null
}

export function readLocalStorageEntries() {
  const keys = Object.keys(localStorage)
  const tokenKey = getSessionTokenStorageKey()

  return keys
    .sort((a, b) => (a === tokenKey ? -1 : b === tokenKey ? 1 : a.localeCompare(b)))
    .map((key) => {
      const rawValue = localStorage.getItem(key)
      const recordedAt = getRecordedAtForKey(key)

      return {
        key,
        value: formatStoredValue(rawValue),
        recordedAt,
      }
    })
}

export function clearCacheAndResetToken() {
  localStorage.clear()
  return ensureSessionToken()
}

