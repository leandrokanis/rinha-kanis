import { redis } from './redis'
import { sleep } from './utils'
import { addSample } from './counters'

const DEFAULT_URL = process.env.PROC_DEFAULT_URL ?? 'http://localhost:8001'
const FALLBACK_URL = process.env.PROC_FALLBACK_URL ?? 'http://localhost:8002'

// Circuit-breaker parameters
const TIMEOUT_MS = Number(process.env.PROC_TIMEOUT_MS ?? 300)
const FAIL_THRESHOLD = Number(process.env.CB_FAIL_THRESHOLD ?? 3)
const OPEN_MS = Number(process.env.CB_OPEN_MS ?? 1000)

export type ProcName = 'default' | 'fallback'

function urlFor(p: ProcName) {
  return p === 'default' ? DEFAULT_URL : FALLBACK_URL
}

async function isOpen(name: ProcName) {
  const until = Number(await redis.get(`cb:${name}:openUntil`)) || 0
  return Date.now() < until
}

async function trip(name: ProcName) {
  await redis.set(`cb:${name}:openUntil`, String(Date.now() + OPEN_MS), 'PX', OPEN_MS)
  await redis.del(`cb:${name}:fails`)
}

async function recordFail(name: ProcName) {
  const fails = await redis.incr(`cb:${name}:fails`)
  if (fails >= FAIL_THRESHOLD) await trip(name)
}

async function recordOk(name: ProcName) {
  await redis.del(`cb:${name}:fails`)
}

export async function sendPayment(proc: ProcName, body: { correlationId: string, amount: number }, authHeader: string) {
  const url = `${urlFor(proc)}/payments`
  const ctrl = new AbortController()
  const to = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': authHeader,
      },
      body: JSON.stringify({ ...body, requestedAt: new Date().toISOString() }),
      signal: ctrl.signal,
    })
    if (!res.ok) {
      await recordFail(proc)
      throw new Error(`processor ${proc} responded ${res.status}`)
    }
    await recordOk(proc)
    await addSample(proc, body.amount)
    return true
  }
  catch (err) {
    await recordFail(proc)
    throw err
  }
  finally {
    clearTimeout(to)
  }
}

export async function processWithFallback(body: { correlationId: string, amount: number }, authHeader: string, maxRetries = 5) {
  let attempt = 0
  while (attempt < maxRetries) {
    attempt += 1
    const order: ProcName[] = (await isOpen('default')) ? ['fallback', 'default'] : ['default', 'fallback']

    for (const proc of order) {
      if (await isOpen(proc)) continue // skip if open
      try {
        await sendPayment(proc, body, authHeader)
        return
      }
      catch (_) {
        // try next
      }
    }

    // backoff exponential with jitter
    const backoff = Math.min(50 * 2 ** attempt, 400)
    await sleep(backoff + Math.floor(Math.random() * 50))
  }
  throw new Error('all processors failed')
}
