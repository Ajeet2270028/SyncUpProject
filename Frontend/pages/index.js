import { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

const API_URL = "http://localhost:4000";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function FeedCard({ feed, isNew = false }) {
  return (
    <div className="feed-card" style={isNew ? { borderLeftColor: "#38a169" } : {}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <h3>{feed.title}</h3>
        {isNew && <span style={{ fontSize: "0.75rem", color: "#38a169", fontWeight: 700 }}>🆕 NEW</span>}
      </div>
      <p>{feed.content}</p>
      <div className="feed-meta">
        <span>👤 {feed.author || "Coach"}</span>
        <span>🕐 {formatDate(feed.createdAt)}</span>
        <span className={`badge badge-${feed.category}`}>{feed.category}</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newFeedIds, setNewFeedIds] = useState(new Set());

  // Fetch feeds on page load
  useEffect(() => {
    async function fetchFeeds() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/feed`);
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();
        setFeeds(data.feeds);
      } catch (err) {
        console.error("Failed to fetch feeds:", err);
        setError("Could not load feeds. Is the backend running?");
      } finally {
        setLoading(false);
      }
    }
    fetchFeeds();
  }, []);

  // Listen for real-time new feeds via Socket.IO
  useSocket("new_feed", (newFeed) => {
    const feedId = newFeed.id || newFeed._id; // ✅ works for both MySQL and MongoDB

    setFeeds((prevFeeds) => {
      // Prevent duplicate feeds
      const alreadyExists = prevFeeds.some(
        (f) => (f.id || f._id) === feedId
      );
      if (alreadyExists) return prevFeeds;
      return [newFeed, ...prevFeeds]; // add to top
    });

    // Highlight as NEW for 5 seconds
    setNewFeedIds((prev) => new Set([...prev, feedId]));
    setTimeout(() => {
      setNewFeedIds((prev) => {
        const updated = new Set(prev);
        updated.delete(feedId);
        return updated;
      });
    }, 5000);
  });

  return (
    <div className="container">
      <div className="page-header">
        <h2>📋 Coaching Feed</h2>
        <span className="live-indicator">
          <span className="live-dot" />
          Live
        </span>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="loading-spinner" />
          <p>Loading feeds...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="alert alert-error">⚠️ {error}</div>
      )}

      {/* Empty */}
      {!loading && !error && feeds.length === 0 && (
        <div className="empty-state">
          <p>No feeds yet. Go to <strong>Admin</strong> to post the first one!</p>
        </div>
      )}

      {/* Feed list — key uses id (MySQL) with _id fallback (MongoDB) */}
      {feeds.map((feed) => (
        <FeedCard
          key={feed.id || feed._id}
          feed={feed}
          isNew={newFeedIds.has(feed.id || feed._id)}
        />
      ))}
    </div>
  );
}