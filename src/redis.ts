import IORedis from 'ioredis'

const url = process.env.REDIS_URL ?? 'redis://localhost:6379'
export const redis = new IORedis(url, {
  lazyConnect: false,
  maxRetriesPerRequest: null,
})

export const QUEUE_KEY = 'q:payments'

export async function enqueue(job: object) {
  await redis.lpush(QUEUE_KEY, JSON.stringify(job))
}

export async function dequeue(timeoutSec = 1): Promise<any | null> {
  const res = await redis.brpop(QUEUE_KEY, timeoutSec)
  if (!res) return null
  const [, payload] = res // [key, value]
  return JSON.parse(payload)
}

export async function purgeAll() {
  await redis.flushdb()
}
