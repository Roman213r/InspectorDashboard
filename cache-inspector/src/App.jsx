import { useCallback, useMemo, useState } from 'react'
import CacheInspectorCard from './components/cards/CacheInspectorCard.jsx'
import LiveMetricsCard from './components/cards/LiveMetricsCard.jsx'
import RequestLogCard from './components/cards/RequestLogCard.jsx'
import SessionTokenCard from './components/cards/SessionTokenCard.jsx'
import { ensureSessionToken } from './utils/sessionToken.js'
import { clearCacheAndResetToken } from './utils/localStorageCache.js'

function createRequestId() {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID()
  } catch {
    void 0
  }
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

export default function App() {
  const [tokenPayload, setTokenPayload] = useState(() => ensureSessionToken())
  const [cacheRefreshNonce, setCacheRefreshNonce] = useState(0)

  const [requestEntries, setRequestEntries] = useState([])

  const handleAddRequestLog = useCallback((entry) => {
    setRequestEntries((prev) => {
      const next = [
        {
          id: createRequestId(),
          time: entry.time,
          status: entry.status,
          latencyMs: entry.latencyMs,
        },
        ...prev,
      ]
      return next.slice(0, 10)
    })
  }, [])

  const handleClearCache = useCallback(() => {
    const nextToken = clearCacheAndResetToken()
    setTokenPayload(nextToken)
    setCacheRefreshNonce((n) => n + 1)
  }, [])

  const headerRight = useMemo(() => {
    return (
      <div className="text-right">
        <div className="text-xs text-slate-400">Inspector Dashboard</div>
        <div className="mt-1 text-sm text-slate-200">Cache + Live metrics</div>
      </div>
    )
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-50">
              Cache Inspector Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Session Token, Live Metrics (polling), localStorage Inspector,
              and Request Log with status filtering.
            </p>
          </div>
          {headerRight}
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SessionTokenCard tokenPayload={tokenPayload} />
          <LiveMetricsCard onLogRequest={handleAddRequestLog} />
          <CacheInspectorCard
            refreshNonce={cacheRefreshNonce}
            onClearCache={handleClearCache}
          />
          <RequestLogCard entries={requestEntries} />
        </div>
      </div>
    </div>
  )
}
