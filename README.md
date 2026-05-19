⚡ SyncUp — Realtime Coaching Feed
A full-stack realtime application built with:

Backend: Node.js + Express + Socket.IO
Database: MySql Database
Cache: Redis
Frontend: Next.js (React)


📁 Project Structure
syncup/
├── backend/
│   ├── config/
│   │   └── redis.js        ← Redis cache helper (get/set/clear)
│   ├── models/
│   │   └── Feed.js         ← MongoDB schema for feed items
│   ├── routes/
│   │   └── feed.js         ← GET /feed and POST /feed endpoints
│   ├── server.js           ← Main entry point (Express + Socket.IO)
│   ├── .env.example        ← Copy to .env and fill in values
│   └── package.json
│
└── frontend/
    ├── hooks/
    │   └── useSocket.js    ← Custom hook for Socket.IO client
    ├── pages/
    │   ├── _app.js         ← Global layout + Navbar
    │   ├── index.js        ← Home page (feed list + realtime)
    │   └── admin.js        ← Admin page (post new feed)
    ├── styles/
    │   └── globals.css     ← All styles
    └── package.json

🛠️ Prerequisites
Make sure you have these installed:

Node.js (v16+)
MongoDB (running locally on port 27017)
Redis (running locally on port 6379)

Start MongoDB (if not running):
bash# macOS with Homebrew
brew services start mongodb-community

# Ubuntu/Linux
sudo systemctl start mongod

# Windows — start from Services or MongoDB Compass
Start Redis (if not running):
bash# macOS with Homebrew
brew services start redis

# Ubuntu/Linux
sudo systemctl start redis

# Or simply: redis-server

🚀 Setup & Run
Step 1: Setup Backend
bashcd syncup/backend

# Install dependencies
npm install

# Start the backend
npm run dev
# → Server runs at http://localhost:4000
Step 2: Setup Frontend
bashcd syncup/frontend

# Install dependencies
npm install

# Start Next.js
npm run dev
# → Frontend runs at http://localhost:3000

🌐 Usage

Open http://localhost:3000 — this is the Home page showing all feeds
Open http://localhost:3000/admin — post new feeds from here
Open the Home page in another browser tab and watch new feeds appear instantly without refresh!
