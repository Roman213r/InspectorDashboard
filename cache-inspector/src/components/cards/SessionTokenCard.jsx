import { useEffect, useMemo, useState } from 'react'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'

function formatDateTime(ts) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return String(ts)
  }
}

export default function SessionTokenCard({ tokenPayload }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const elapsedSeconds = useMemo(() => {
    if (!tokenPayload?.createdAt) return null
    return Math.max(0, Math.floor((now - tokenPayload.createdAt) / 1000))
  }, [now, tokenPayload?.createdAt])

  async function handleCopy() {
    if (!tokenPayload?.token) return
    try {
      await navigator.clipboard.writeText(tokenPayload.token)
    } catch {
      void 0
    }
  }

  return (
    <Card
      title="Session Token"
      subtitle="Генерується 1 раз і зберігається в localStorage"
      right={
        <Button variant="ghost" onClick={handleCopy} disabled={!tokenPayload?.token}>
          Copy
        </Button>
      }
    >
      {tokenPayload ? (
        <div className="space-y-3">
          <div>
            <div className="text-xs text-slate-400">Token</div>
            <div className="mt-1 break-all rounded bg-slate-950/60 border border-slate-800 px-3 py-2 text-xs font-mono text-slate-100">
              {tokenPayload.token}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-400">Created at</div>
              <div className="mt-1 text-sm text-slate-100">{formatDateTime(tokenPayload.createdAt)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Elapsed</div>
              <div className="mt-1 text-sm text-slate-100">
                {elapsedSeconds == null ? '—' : `${elapsedSeconds}s`}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-400">Token is being created…</div>
      )}
    </Card>
  )
}

