# API-ReplayLab 🔁

A tool for recording, replaying, and comparing API requests — useful for regression testing and debugging API changes.

## Features
- 📼 Record API requests as baselines
- ▶️ Replay requests and compare responses
- 📊 Diff viewer for response comparison
- 📋 Report generation
- 🔐 User authentication (JWT)
- 🐳 Docker support

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Node.js, Express, MongoDB
- **Auth:** JWT
- **CI/CD:** Jenkins, Docker

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB

### Setup

**Backend**
```bash
cd backend
cp .env.example .env    # Fill in your values
npm install
npm start
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173` | API on `http://localhost:5000`

## Environment Variables

Create `backend/.env`:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/api-replaylab
JWT_SECRET=your_strong_secret_key
ALLOWED_ORIGINS=http://localhost:5173
```

## Docker
```bash
docker-compose -f docker/docker-compose.yml up
```
