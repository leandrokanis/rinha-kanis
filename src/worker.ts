import { dequeue } from './redis'
import { processWithFallback } from './processor'

console.log('Worker started');

(async () => {
  while (true) {
    try {
      const job = await dequeue(1)
      if (!job) continue
      const { correlationId, amount, auth, tries = 0 } = job
      try {
        await processWithFallback({ correlationId, amount }, auth)
      }
      catch (err) {
        if (tries < 5) {
          job.tries = tries + 1
          await new Promise(r => setTimeout(r, 20))
          await import('./redis').then(({ enqueue }) => enqueue(job))
        }
      }
    }
    catch (err) {
      console.error('worker error', err)
    }
  }
})()
