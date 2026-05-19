// routes/feed.js
const express = require("express");
const router = express.Router();
const Feed = require("../models/Feed");
const { getCachedFeed, setCachedFeed, clearFeedCache } = require("../config/redis");

// ── GET /feed ──────────────────────────────────
// Check Redis cache first → else query MySQL
router.get("/", async (req, res) => {
  try {
    // Step 1: Check Redis cache
    const cached = await getCachedFeed();
    if (cached) {
      return res.json({ success: true, source: "cache", feeds: cached });
    }

    // Step 2: Query MySQL — newest first
    const feeds = await Feed.findAll({
      order: [["createdAt", "DESC"]],
    });

    // Step 3: Save to Redis cache
    await setCachedFeed(feeds);

    res.json({ success: true, source: "database", feeds });

  } catch (error) {
    console.error("GET /feed error:", error);
    res.status(500).json({ success: false, message: "Server error fetching feeds" });
  }
});

// ── POST /feed ─────────────────────────────────
// Save new feed to MySQL → clear cache → emit socket event
router.post("/", async (req, res) => {
  try {
    const { title, content, author, category } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Step 1: Insert into MySQL
    const newFeed = await Feed.create({
      title: title.trim(),
      content: content.trim(),
      author: author?.trim() || "Coach",
      category: category || "update",
    });

    // Step 2: Clear Redis cache so next GET is fresh
    await clearFeedCache();

    // Step 3: Emit real-time event to all connected clients
    req.io.emit("new_feed", newFeed);

    res.status(201).json({ success: true, feed: newFeed });

  } catch (error) {
    console.error("POST /feed error:", error);
    res.status(500).json({ success: false, message: "Server error creating feed" });
  }
});

module.exports = router;