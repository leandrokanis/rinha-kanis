import { enqueue, purgeAll, redis } from './redis'
import { summarize } from './counters'
import { parseISO } from './utils'

const PORT = Number(process.env.PORT ?? 3000)

function bad(msg: string, status = 400) {
  return new Response(JSON.stringify({ error: msg }), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}
function ok(data?: any, status = 200) {
  return new Response(data ? JSON.stringify(data) : null, {
    status,
    headers: data ? { 'content-type': 'application/json' } : {},
  })
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const { pathname, searchParams } = new URL(req.url)

    if (req.method === 'POST' && pathname === '/payments') {
      let body: any
      try {
        body = await req.json()
      }
      catch {
        return bad('invalid json')
      }
      const correlationId = String(body?.correlationId ?? '').trim()
      const amount = Number(body?.amount)
      if (!correlationId || !Number.isFinite(amount) || amount <= 0) return bad('invalid fields')

      // idempotency (1h)
      const key = `cid:${correlationId}`
      const set = await redis.set(key, '1', 'NX', 'EX', 3600)
      if (set === null) return ok() // already processed / enqueued

      const auth = req.headers.get('authorization') || `Bearer ${process.env.TOKEN ?? ''}`
      await enqueue({ correlationId, amount, auth, enqueuedAt: Date.now(), tries: 0 })
      return ok()
    }

    if (req.method === 'GET' && pathname === '/payments-summary') {
      const from = parseISO(searchParams.get('from')) ?? new Date(Date.now() - 5 * 60 * 1000)
      const to = parseISO(searchParams.get('to')) ?? new Date()
      const [d, f] = await Promise.all([
        summarize('default', from, to),
        summarize('fallback', from, to),
      ])
      return ok({ default: d, fallback: f })
    }

    if (req.method === 'POST' && pathname === '/purge-payments') {
      await purgeAll()
      return ok({ result: 'ok' })
    }

    return new Response('not found', { status: 404 })
  },
})

console.log(`API listening on :${PORT}`)
