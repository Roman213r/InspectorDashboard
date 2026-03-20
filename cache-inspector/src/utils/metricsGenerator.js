function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

export function generateLiveMetrics(prev) {
  const lastCpu = prev?.cpuPct ?? randomBetween(20, 55)
  const lastMem = prev?.memPct ?? randomBetween(25, 70)
  const lastSessions = prev?.activeSessions ?? Math.floor(randomBetween(20, 80))

  const cpuDelta = randomBetween(-12, 12)
  const memDelta = randomBetween(-10, 10)
  const sessionsDelta = Math.floor(randomBetween(-8, 10))

  const cpuPct = clamp(lastCpu + cpuDelta, 0, 100)
  const memPct = clamp(lastMem + memDelta, 0, 100)
  const activeSessions = clamp(lastSessions + sessionsDelta, 0, 999)

  return {
    cpuPct: Math.round(cpuPct),
    memPct: Math.round(memPct),
    activeSessions: Math.round(activeSessions),
    capturedAt: Date.now(),
  }
}

