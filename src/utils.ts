export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms))

export const nowSecKey = (d: Date = new Date()) => {
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = d.getUTCFullYear()
  const mm = pad(d.getUTCMonth() + 1)
  const dd = pad(d.getUTCDate())
  const hh = pad(d.getUTCHours())
  const mi = pad(d.getUTCMinutes())
  const ss = pad(d.getUTCSeconds())
  return `${yyyy}${mm}${dd}${hh}${mi}${ss}`
}

export const rangeSeconds = (from: Date, to: Date) => {
  const out: string[] = []
  let ts = Math.floor(from.getTime() / 1000)
  const end = Math.floor(to.getTime() / 1000)
  for (; ts <= end; ts++) {
    out.push(nowSecKey(new Date(ts * 1000)))
  }
  return out
}

export const parseISO = (s?: string | null) => (s ? new Date(s) : undefined)
