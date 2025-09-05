import { redis } from './redis'
import { nowSecKey, rangeSeconds } from './utils'

export async function addSample(proc: 'default' | 'fallback', amount: number, at: Date = new Date()) {
  const base = `${proc}:${nowSecKey(at)}`
  await redis
    .multi()
    .incr(`count:${base}`)
    .incrbyfloat(`sum:${base}`, amount)
    .exec()
}

export async function summarize(proc: 'default' | 'fallback', from: Date, to: Date) {
  const keysCount = rangeSeconds(from, to).map(k => `count:${proc}:${k}`)
  const keysSum = rangeSeconds(from, to).map(k => `sum:${proc}:${k}`)
  const [counts, sums] = await Promise.all([
    keysCount.length ? redis.mget(keysCount) : [],
    keysSum.length ? redis.mget(keysSum) : [],
  ])
  let totalRequests = 0
  let totalAmount = 0
  for (const c of counts) totalRequests += Number(c ?? 0)
  for (const s of sums) totalAmount += Number(s ?? 0)
  return { totalRequests, totalAmount: Number(totalAmount.toFixed(2)) }
}
