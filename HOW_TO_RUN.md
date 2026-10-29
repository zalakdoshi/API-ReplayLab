# 🚀 HOW TO RUN API REPLAYLAB - COMPLETE GUIDE

## ✅ **CURRENT STATUS**

Your project is **ALREADY RUNNING**! 🎉

- ✅ Backend: **RUNNING** on http://localhost:5000
- ✅ Frontend: **RUNNING** on http://localhost:3000
- ✅ MongoDB: **CONNECTED** (MongoDB Atlas)
- ✅ Sample Data: **LOADED** (5 requests, 3 baselines, 3 replay runs, 1 report)

---

## 🌐 **STEP 1: OPEN THE APPLICATION**

**Open your browser and go to:**

```
http://localhost:3000
```

You should see the **API ReplayLab Dashboard**! 🎨

---

## 📊 **STEP 2: EXPLORE THE DASHBOARD**

You'll see:
- **Total Requests:** 5
- **Total Replays:** 3
- **Regressions Detected:** 1
- **Reports:** 1
- **Recent Activity:** Latest replay runs

---

## 📝 **STEP 3: VIEW REQUEST LIBRARY**

1. Click **"Request Library"** in the sidebar
2. You'll see 5 sample requests:
   - Get User Profile
   - Create Post
   - Get All Posts
   - Get Comments
   - Get Todo Item (has regression!)

3. Each request shows:
   - HTTP Method (GET/POST)
   - URL
   - Category
   - Critical flag

---

## 🔄 **STEP 4: EXECUTE A REPLAY**

1. Click **"Replay Runner"** in sidebar
2. Check the boxes next to requests you want to test
3. (Optional) Enter a custom target URL
4. Click **"Execute X Request(s)"**
5. Wait 2-3 seconds
6. Go back to **Dashboard** to see results!

---

## 📈 **STEP 5: VIEW REPORTS**

1. Click **"Reports"** in sidebar
2. You'll see the "Daily Regression Report"
3. Click on it to see:
   - Total tests: 3
   - Passed: 2
   - Failed: 1
   - Regression details with reasons

---

## 🆕 **STEP 6: CREATE A NEW REQUEST**

1. Click **"Request Library"**
2. Click **"New Request"** button
3. Fill in:
   ```
   Name: My Test Request
   Method: GET
   URL: https://jsonplaceholder.typicode.com/users
   ```
4. Click **"Create Request"**
5. Your request is saved!

---

## 🛑 **HOW TO STOP THE SERVERS**

If you need to stop:

### **Option 1: Using Task Manager**
1. Press `Ctrl + Shift + Esc`
2. Find "Node.js" processes
3. End task for both

### **Option 2: Using PowerShell**
```powershell
taskkill /F /IM node.exe
```

---

## 🔄 **HOW TO RESTART**

If servers stopped, restart them:

### **Terminal 1 - Backend:**
```powershell
cd "d:\Materialss\Btech\Semester-7\ASE\Project\API-ReplayLab\backend"
npm run dev
```

### **Terminal 2 - Frontend (NEW window):**
```powershell
cd "d:\Materialss\Btech\Semester-7\ASE\Project\API-ReplayLab\frontend"
npm run dev
```

Wait 10 seconds, then open: http://localhost:3000

---

## 🔧 **TROUBLESHOOTING**

### **Problem: Port already in use**
```powershell
# Kill port 5000
netstat -ano | findstr :5000
taskkill /PID <number> /F

# Kill port 3000
netstat -ano | findstr :3000
taskkill /PID <number> /F
```

### **Problem: Can't connect to MongoDB**
- Check internet connection
- MongoDB Atlas requires internet

### **Problem: Page not loading**
- Make sure both backend AND frontend are running
- Check browser console (F12)

---

## 🎯 **WHAT YOU CAN DEMO**

### **1. Dashboard**
- Show statistics
- Show recent activity
- Explain the quick action cards

### **2. Request Library**
- Show saved requests
- Create a new one
- Edit existing
- Delete one

### **3. Replay Execution**
- Select multiple requests
- Execute batch
- Show real-time status

### **4. Regression Detection**
- Open "Get Todo Item" request
- Execute replay
- Show it detects regression
- Explain the diff

### **5. Reports**
- Show generated report
- Explain pass/fail status
- Show regression details

---

## 🌟 **IMPRESSIVE DEMO POINTS**

1. **"This is a full-stack MERN application"**
   - MongoDB Atlas (cloud database)
   - Express backend
   - React frontend
   - Node.js runtime

2. **"It detects business logic errors, not just status codes"**
   - Show the Todo Item regression
   - Point out it returned 200 OK but data was wrong

3. **"It integrates with CI/CD"**
   - Show Jenkins (if set up)
   - Explain how it blocks deployment

4. **"All data is stored in the cloud"**
   - MongoDB Atlas
   - No local database needed

5. **"It follows industry best practices"**
   - RESTful API design
   - Component-based frontend
   - Proper error handling
   - Security measures (sanitization)

---

## 📸 **SCREENSHOT GUIDE FOR PPT**

Take screenshots of:
1. ✅ Dashboard (main view)
2. ✅ Request Library (list of requests)
3. ✅ Create Request form
4. ✅ Replay Runner (with checkboxes)
5. ✅ Reports page
6. ✅ Report details (showing regression)
7. ✅ Jenkins pipeline (if setup)
8. ✅ Database (MongoDB Atlas web interface)

---

## 🎓 **FOR YOUR VIVA**

### **Opening Statement:**
> "I've built API ReplayLab, an automated regression testing platform that detects API behavioral changes before they reach production. Let me show you how it works."

### **Demo Flow (5 minutes):**
1. Open dashboard → Point out statistics
2. Go to Request Library → Show saved requests
3. Click Replay Runner → Execute a replay
4. Go back to Dashboard → Show new activity
5. Open Reports → Show regression detected
6. Explain: "This prevents bugs from reaching customers"

### **Technical Questions - Be Ready:**
- **Q: What database?** A: MongoDB Atlas, cloud-hosted
- **Q: What framework?** A: MERN stack (MongoDB, Express, React, Node.js)
- **Q: How does it detect regressions?** A: Deep comparison of JSON responses
- **Q: How does it integrate with CI/CD?** A: Jenkins pipeline with automated tests
- **Q: What about security?** A: Data sanitization, environment variables, HTTPS

---

## 🎉 **YOU'RE ALL SET!**

**Your application is:**
- ✅ Running successfully
- ✅ Connected to cloud database
- ✅ Has sample data loaded
- ✅ Ready to demonstrate
- ✅ Fully functional

**Just open http://localhost:3000 and start exploring!** 🚀

---

**Quick Links:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- API Health: http://localhost:5000/api/health
- Jenkins: http://localhost:8080 (if setup)

**Need Help?**
- Check PROJECT_REPORT.md for technical details
- Check PPT_CONTENT.md for presentation content
- Check SETUP_GUIDE.md for installation help

**ENJOY YOUR PROJECT! 🎊**
