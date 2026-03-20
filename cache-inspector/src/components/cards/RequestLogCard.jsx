import { useMemo, useState } from 'react'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'

function formatLatency(latencyMs) {
  if (typeof latencyMs !== 'number') return '—'
  return `${latencyMs} ms`
}

function StatusPill({ status }) {
  const isOk = status === 'success'
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium'
  const cls = isOk
    ? 'bg-emerald-500/15 text-emerald-200 border border-emerald-500/30'
    : 'bg-red-500/15 text-red-200 border border-red-500/30'

  return (
    <span className={`${base} ${cls}`}>
      {isOk ? 'success' : 'error'}
    </span>
  )
}

export default function RequestLogCard({ entries }) {
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    if (filter === 'all') return entries
    return entries.filter((e) => e.status === filter)
  }, [entries, filter])

  return (
    <Card
      title="Request Log"
      subtitle="Останні 10 імітацій fetch-запитів"
      right={
        <div className="flex gap-2">
          <Button variant={filter === 'success' ? 'primary' : 'ghost'} onClick={() => setFilter('success')}>
            Success
          </Button>
          <Button variant={filter === 'error' ? 'primary' : 'ghost'} onClick={() => setFilter('error')}>
            Error
          </Button>
        </div>
      }
    >
      <div className="mb-2 flex items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing{' '}
          <span className="text-slate-200">
            {filter === 'all' ? 'all' : filter}
          </span>
        </div>
        <div>
          Total:{' '}
          <span className="text-slate-200">{entries.length}</span>
        </div>
      </div>

      <div className="max-h-[360px] overflow-auto rounded-lg border border-slate-800">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-slate-900/90">
            <tr className="text-left text-slate-400">
              <th className="px-3 py-2 font-medium">Time</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Latency</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.length ? (
              filtered.map((e) => (
                <tr key={e.id}>
                  <td className="px-3 py-2 font-mono text-slate-300">
                    {new Date(e.time).toLocaleTimeString()}
                  </td>
                  <td className="px-3 py-2">
                    <StatusPill status={e.status} />
                  </td>
                  <td className="px-3 py-2 text-slate-200">
                    {formatLatency(e.latencyMs)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-3 py-4 text-slate-400" colSpan={3}>
                  No requests for this filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex justify-end">
        <Button variant="ghost" onClick={() => setFilter('all')}>
          Show All
        </Button>
      </div>
    </Card>
  )
}

