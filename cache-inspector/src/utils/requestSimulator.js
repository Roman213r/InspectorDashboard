function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1))
}

export async function simulateFetchRequest({
  successRate = 0.82,
  minLatencyMs = 60,
  maxLatencyMs = 420,
} = {}) {
  const latencyMs = randomInt(minLatencyMs, maxLatencyMs)
  const startedAt = Date.now()
  await wait(latencyMs)

  const ok = Math.random() < successRate
  const finishedAt = Date.now()

  return {
    time: new Date(startedAt).toISOString(),
    status: ok ? 'success' : 'error',
    latencyMs: Math.max(0, finishedAt - startedAt),
  }
}

