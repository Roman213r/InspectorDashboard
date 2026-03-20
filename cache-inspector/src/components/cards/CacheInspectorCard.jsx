import { useEffect, useMemo, useState } from 'react'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import { readLocalStorageEntries } from '../../utils/localStorageCache.js'
import { getSessionTokenStorageKey } from '../../utils/sessionToken.js'

function formatDateTime(ts) {
  try {
    return new Date(ts).toLocaleString()
  } catch {
    return String(ts)
  }
}

export default function CacheInspectorCard({ refreshNonce, onClearCache }) {
  const tokenKey = useMemo(() => getSessionTokenStorageKey(), [])
  const [rows, setRows] = useState(() => readLocalStorageEntries())

  useEffect(() => {
    setRows(readLocalStorageEntries())
  }, [refreshNonce])

  function handleRefresh() {
    setRows(readLocalStorageEntries())
  }

  function handleClearCache() {
    const ok = window.confirm(
      'Clear Cache?\n\nThis will clear localStorage and generate a new session token.'
    )
    if (!ok) return

    onClearCache()
    setRows(readLocalStorageEntries())
  }

  return (
    <Card
      title="Cache Inspector"
      subtitle="Поточний вміст localStorage + дата запису"
      right={
        <div className="flex gap-2">
          <Button onClick={handleRefresh}>Refresh</Button>
          <Button variant="danger" onClick={handleClearCache}>
            Clear Cache
          </Button>
        </div>
      }
    >
      <div className="max-h-[360px] overflow-auto rounded-lg border border-slate-800">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-slate-900/90">
            <tr className="text-left text-slate-400">
              <th className="px-3 py-2 font-medium">Key</th>
              <th className="px-3 py-2 font-medium">Value</th>
              <th className="px-3 py-2 font-medium">Recorded at</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.length ? (
              rows.map((r) => {
                const isToken = r.key === tokenKey
                return (
                  <tr
                    key={r.key}
                    className={isToken ? 'bg-emerald-500/10' : undefined}
                  >
                    <td className="px-3 py-2 font-mono text-slate-100">
                      <div className="flex items-center gap-2">
                        {isToken ? (
                          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        ) : null}
                        <span className={isToken ? 'text-emerald-200' : undefined}>
                          {r.key}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div
                        className={
                          isToken
                            ? 'break-all font-mono text-emerald-100'
                            : 'break-all font-mono text-slate-300'
                        }
                      >
                        {r.value}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-300">
                      {typeof r.recordedAt === 'number'
                        ? formatDateTime(r.recordedAt)
                        : '—'}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td className="px-3 py-4 text-slate-400" colSpan={3}>
                  No localStorage items
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

