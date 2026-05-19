// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { connectDB } = require("./config/database"); // ← MySQL instead of mongoose

const feedRoutes = require("./routes/feed");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Attach socket.io to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/feed", feedRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SyncUp API is running 🚀" });
});

io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on("disconnect", (reason) => {
    console.log(`❌ Client disconnected: ${socket.id} — ${reason}`);
  });
});

const PORT = process.env.PORT || 4000;

// Connect to MySQL first, then start server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});






