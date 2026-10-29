# 🚀 How to Run API ReplayLab - Complete Guide

## ✅ Your MongoDB is Already Configured!

Your MongoDB Atlas connection is set up:
```
mongodb+srv://API_ReplayLAb:caVWp0YpsptFXIWv@cluster0.vlp7dci.mongodb.net/api-replaylab
```

---

## 📋 Step-by-Step Instructions

### Step 1: Install Dependencies

Open PowerShell in the project folder and run:

```powershell
# Navigate to project
cd "d:\Materialss\Btech\Semester-7\ASE\Project\API-ReplayLab"

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**Wait for both installations to complete (2-5 minutes)**

---

### Step 2: Start the Backend Server

Open **Terminal 1** (PowerShell):

```powershell
cd "d:\Materialss\Btech\Semester-7\ASE\Project\API-ReplayLab\backend"
npm run dev
```

**You should see:**
```
Server running in development mode on port 5000
MongoDB Connected: cluster0.vlp7dci.mongodb.net
```

✅ Keep this terminal **OPEN**

---

### Step 3: Start the Frontend

Open **Terminal 2** (New PowerShell window):

```powershell
cd "d:\Materialss\Btech\Semester-7\ASE\Project\API-ReplayLab\frontend"
npm run dev
```

**You should see:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

✅ Keep this terminal **OPEN**

---

### Step 4: Access the Application

Open your browser and go to:

**🌐 http://localhost:3000**

You should see the API ReplayLab dashboard!

---

## 🎯 Quick Test

1. Click **"Request Library"** in the sidebar
2. Click **"New Request"** button
3. Fill in:
   - **Name**: Test Request
   - **Method**: GET
   - **URL**: https://jsonplaceholder.typicode.com/todos/1
4. Click **"Create Request"**
5. Go to **"Replay Runner"**
6. Select your request
7. Click **"Execute"**
8. Watch it run!

---

## 🔧 Troubleshooting

### If Backend Won't Start:

**Error: "Port 5000 already in use"**
```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill that process (replace <PID> with the number you see)
taskkill /PID <PID> /F

# Try starting backend again
npm run dev
```

**Error: "Cannot connect to MongoDB"**
- Check your internet connection (MongoDB Atlas is online)
- Verify the .env file has the correct connection string
- Make sure there are no extra spaces in the MONGODB_URI line

### If Frontend Won't Start:

**Error: "Port 3000 already in use"**
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Try again
npm run dev
```

### If Dependencies Fail to Install:

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
Remove-Item node_modules -Recurse -Force
npm install
```

---

## 🎬 Full Project Demo Flow

### 1. Create API Request
- Name: "Get User Order Total"
- Method: POST
- URL: https://jsonplaceholder.typicode.com/posts
- Body:
```json
{
  "title": "Test Order",
  "body": "Order calculation test",
  "userId": 1
}
```
- Mark as **Critical**

### 2. Execute Replay
- Go to Replay Runner
- Select your request
- Click "Execute"
- View results in Dashboard

### 3. View Reports
- Go to Reports section
- See regression statistics
- View detailed comparisons

---

## 📊 What's Running?

| Service | URL | Status |
|---------|-----|--------|
| Frontend | http://localhost:3000 | Should be accessible |
| Backend API | http://localhost:5000 | Should respond with JSON |
| MongoDB | Cloud (Atlas) | Connected automatically |
| API Health | http://localhost:5000/api/health | Check backend status |

---

## 🛑 How to Stop

1. In **Backend Terminal**: Press `Ctrl + C`
2. In **Frontend Terminal**: Press `Ctrl + C`
3. Type `Y` if asked to terminate

---

## 🔄 How to Restart

```powershell
# Backend Terminal
cd backend
npm run dev

# Frontend Terminal (in new window)
cd frontend
npm run dev
```

---

## 📸 Expected Screenshots

### Dashboard
You should see:
- Total Requests: 0 (initially)
- Total Replays: 0 (initially)
- Regressions: 0
- Quick action cards

### Request Library
- List of saved API requests
- "New Request" button
- Search functionality

### Replay Runner
- Select requests checkbox
- Target URL input
- "Execute" button

---

## ✅ Success Checklist

- [x] MongoDB connection configured
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 3000)
- [ ] Can access http://localhost:3000
- [ ] Can create a request
- [ ] Can execute a replay

---

## 🆘 Still Having Issues?

### Check Backend Console
Look for error messages in the backend terminal

### Check Browser Console
1. Press `F12` in browser
2. Go to "Console" tab
3. Look for red error messages

### Test API Directly
```powershell
# Test if backend is responding
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123
}
```

---

**You're all set! The project is ready to run. Just follow the steps above! 🚀**

**Next: See JENKINS_SETUP.md for CI/CD configuration**
