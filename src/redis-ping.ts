import IORedis from "ioredis";
const redis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
const key = "rinha:hello";
const value = Date.now().toString();

await redis.set(key, value, "EX", 30);
const got = await redis.get(key);
console.log("SET=>", value, " GET=>", got);
await redis.quit();
