// config/redis.js
// Redis is used as a fast in-memory cache to avoid hitting MongoDB every time

const Redis = require("ioredis");

// Create Redis client with your .env settings
const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  // If Redis is not available, don't crash the app — just log the error
  lazyConnect: true,
});

// Log connection events
redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err.message));

// How long to cache the feed (in seconds)
// 60 seconds = data is refreshed from DB every minute
const CACHE_TTL = 60;
const CACHE_KEY = "feed:all"; // the key we store data under in Redis

/**
 * Get cached feed from Redis
 * Returns parsed JSON array, or null if nothing cached
 */
async function getCachedFeed() {
  try {
    const data = await redis.get(CACHE_KEY);
    if (data) {
      console.log("📦 Serving from Redis cache");
      return JSON.parse(data); // Redis stores strings, so we parse it back to JS
    }
    return null; // cache miss = go to DB
  } catch (err) {
    console.error("Redis get error:", err.message);
    return null; // if Redis fails, fall back to DB
  }
}

/**
 * Save feed data to Redis cache
 * @param {Array} feedData - array of feed items to cache
 */
async function setCachedFeed(feedData) {
  try {
    // JSON.stringify converts JS object → string (Redis only stores strings)
    await redis.set(CACHE_KEY, JSON.stringify(feedData), "EX", CACHE_TTL);
    console.log(`📝 Feed cached for ${CACHE_TTL}s`);
  } catch (err) {
    console.error("Redis set error:", err.message);
  }
}

/**
 * Clear the cache — called when a new feed is posted
 * so the next GET fetches fresh data from MongoDB
 */
async function clearFeedCache() {
  try {
    await redis.del(CACHE_KEY);
    console.log("🗑️ Feed cache cleared");
  } catch (err) {
    console.error("Redis del error:", err.message);
  }
}

module.exports = { redis, getCachedFeed, setCachedFeed, clearFeedCache };