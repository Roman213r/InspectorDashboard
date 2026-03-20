import { useEffect, useMemo, useRef, useState } from 'react'
import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import { generateLiveMetrics } from '../../utils/metricsGenerator.js'
import { setCacheItem } from '../../utils/localStorageCache.js'
import { simulateFetchRequest } from '../../utils/requestSimulator.js'

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString()
  } catch {
    return String(ts)
  }
}

function pointsFor(values, { min = 0, max = 100, width = 200, height = 40 } = {}) {
  if (!values?.length) return ''
  const step = width / Math.max(1, values.length - 1)
  return values
    .map((v, i) => {
      const x = i * step
      const pct = (v - min) / (max - min)
      const clamped = Math.max(0, Math.min(1, pct))
      const y = height - clamped * height
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}

export default function LiveMetricsCard({ onLogRequest }) {
  const [paused, setPaused] = useState(false)
  const [metrics, setMetrics] = useState(() => generateLiveMetrics())
  const [history, setHistory] = useState(() => [metrics])

  const metricsRef = useRef(metrics)
  const mountedRef = useRef(true)

  const historySize = 24

  useEffect(() => {
    metricsRef.current = metrics
  }, [metrics])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (paused) return

    let inFlight = false
    let cancelled = false

    async function tick() {
      if (cancelled || inFlight) return
      inFlight = true

      const next = generateLiveMetrics(metricsRef.current)
      metricsRef.current = next

      if (mountedRef.current) {
        setMetrics(next)
        setHistory((prev) => {
          const updated = [...prev, next].slice(-historySize)
          return updated
        })
      }

      try {
        setCacheItem('cache_metrics_latest', next)
      } catch {
        void 0
      }

      try {
        const logEntry = await simulateFetchRequest({
          successRate: 0.82,
          minLatencyMs: 70,
          maxLatencyMs: 520,
        })

        if (!cancelled && mountedRef.current) {
          onLogRequest(logEntry)
        }
      } finally {
        inFlight = false
      }
    }

    tick()
    const id = setInterval(() => tick(), 5000)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [paused, onLogRequest])

  const cpuSeries = useMemo(() => history.map((h) => h.cpuPct), [history])
  const memSeries = useMemo(() => history.map((h) => h.memPct), [history])
  const cpuPoints = useMemo(() => pointsFor(cpuSeries), [cpuSeries])
  const memPoints = useMemo(() => pointsFor(memSeries), [memSeries])

  return (
    <Card
      title="Live Metrics"
      subtitle="Псевдометрики з polling кожні 5 секунд"
      right={
        <Button
          variant={paused ? 'primary' : 'ghost'}
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
        >
          {paused ? 'Paused' : 'Live'}
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>CPU %</span>
              <span className="text-slate-100 font-medium">{metrics.cpuPct}%</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded bg-slate-800">
              <div
                className="h-full bg-cyan-500"
                style={{ width: `${metrics.cpuPct}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Memory %</span>
              <span className="text-slate-100 font-medium">{metrics.memPct}%</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded bg-slate-800">
              <div
                className="h-full bg-indigo-500"
                style={{ width: `${metrics.memPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-xs text-slate-400">Active Sessions</div>
            <div className="mt-1 text-3xl font-semibold text-slate-100">
              {metrics.activeSessions}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Last update: {formatTime(metrics.capturedAt)}
            </div>
          </div>

          <div className="w-52">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                CPU
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                MEM
              </span>
            </div>
            <svg viewBox="0 0 200 40" className="mt-2 h-10 w-full">
              <polyline
                fill="none"
                stroke="rgba(103, 232, 249, 0.9)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={cpuPoints}
              />
              <polyline
                fill="none"
                stroke="rgba(129, 140, 248, 0.95)"
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={memPoints}
              />
            </svg>
          </div>
        </div>
      </div>
    </Card>
  )
}

