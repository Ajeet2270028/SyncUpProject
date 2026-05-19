// pages/admin.js
// Admin page — coaches can post new feed items here

import { useState } from "react";


const API_URL = "http://localhost:4000";

// Initial form state — makes it easy to reset after submit
const INITIAL_FORM = {
  title: "",
  content: "",
  author: "",
  category: "update",
};

export default function AdminPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false); // prevent double-submit
  const [status, setStatus] = useState(null); // { type: "success"|"error", msg: "..." }

  // Handle any input field change
  // We use a single handler for all fields using the "name" attribute
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault(); // don't reload the page

    // Basic client-side validation
    if (!form.title.trim() || !form.content.trim()) {
      setStatus({ type: "error", msg: "Title and content are required." });
      return;
    }

    try {
      setSubmitting(true);
      setStatus(null); // clear previous status

      // POST to our backend API
      const res = await fetch(`${API_URL}/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          author: form.author.trim() || "Coach",
          category: form.category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // API returned an error (e.g. 400 validation error)
        throw new Error(data.message || "Failed to post feed");
      }

      // Success!
      setStatus({ type: "success", msg: `✅ Feed posted! It's now live on the home page.` });
      setForm(INITIAL_FORM); // clear the form

    } catch (err) {
      console.error("Post feed error:", err);
      setStatus({ type: "error", msg: `❌ Error: ${err.message}` });
    } finally {
      setSubmitting(false); // always re-enable the button
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>🛠️ Admin — Post a Feed</h2>
      </div>

      <div className="form-card">
        {/* Status message */}
        {status && (
          <div className={`alert alert-${status.type}`}>
            {status.msg}
          </div>
        )}

        {/* NOTE: We use a div, not <form>, because Next.js artifacts prefer div + onClick */}
        <div>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Stay consistent!"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your coaching message here..."
              value={form.content}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              id="author"
              name="author"
              type="text"
              placeholder="e.g. Coach Raj (optional)"
              value={form.author}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="update">Update</option>
              <option value="motivation">Motivation</option>
              <option value="tip">Tip</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting} // prevent double-click
          >
            {submitting ? "Posting..." : "Post Feed 🚀"}
          </button>
        </div>
      </div>

      <p style={{ marginTop: "1rem", color: "#718096", fontSize: "0.85rem" }}>
        💡 After posting, the feed will appear live on the Home page without refresh.
      </p>
    </div>
  );
}