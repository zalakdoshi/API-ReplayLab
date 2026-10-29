# API ReplayLab - Quick Reference Card

## 🚀 Quick Start Commands

### Setup (First Time)
```powershell
# Run the quick start script
.\quick-start.ps1

# OR manually:
cd backend && npm install && cd..
cd frontend && npm install && cd..
```

### Run Development Mode
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### Run with Docker
```powershell
cd docker
docker-compose up -d

# Stop
docker-compose down
```

## 📍 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main UI |
| Backend API | http://localhost:5000 | REST API |
| MongoDB | mongodb://localhost:27017 | Database |
| Jenkins | http://localhost:8080 | CI/CD |
| SonarQube | http://localhost:9000 | Code Quality |

## 🔑 Key API Endpoints

### Requests
```bash
GET    /api/requests           # List all
POST   /api/requests           # Create
GET    /api/requests/:id       # Get one
PUT    /api/requests/:id       # Update
DELETE /api/requests/:id       # Delete
POST   /api/requests/import/curl  # Import cURL
```

### Replay
```bash
POST   /api/replay/execute/:requestId  # Execute single
POST   /api/replay/batch              # Execute multiple
GET    /api/replay/status/:runId      # Get status
GET    /api/replay/runs                # List all runs
```

### Reports
```bash
POST   /api/reports/generate    # Generate report
GET    /api/reports             # List all
GET    /api/reports/:id         # Get one
GET    /api/reports/build/:buildId  # Get by build
```

## 📊 Database Collections

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| requests | API definitions | name, method, url, expectedResponse |
| replayruns | Execution results | requestId, actualResponse, regression |
| baselines | Expected responses | requestId, response, version |
| reports | Aggregated results | runIds, summary, status |

## 🐳 Docker Commands

```powershell
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# Remove volumes (clean database)
docker-compose down -v
```

## 🔧 Common Tasks

### Create a Request via cURL
```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Request",
    "method": "GET",
    "url": "https://api.example.com/test"
  }'
```

### Execute Replay
```bash
curl -X POST http://localhost:5000/api/replay/execute/REQUEST_ID \
  -H "Content-Type: application/json" \
  -d '{
    "targetUrl": "http://localhost:8080",
    "triggeredBy": "manual"
  }'
```

### Generate Report
```bash
curl -X POST http://localhost:5000/api/reports/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Report",
    "runIds": ["RUN_ID_1", "RUN_ID_2"]
  }'
```

## 🧪 Testing Commands

```powershell
# Backend tests
cd backend
npm test                    # Run once
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage

# Frontend lint
cd frontend
npm run lint
npm run lint:fix
```

## 📦 Project Structure (Quick View)

```
API-ReplayLab/
├── backend/          # Node.js + Express + MongoDB
│   ├── models/       # Database schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API routes
│   └── utils/        # Helpers
├── frontend/         # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/    # Main views
│   │   └── services/ # API client
├── docker/           # Docker configs
└── jenkins/          # CI/CD pipeline
```

## 🎯 Demo Checklist

**Before Starting:**
- [ ] MongoDB running
- [ ] Backend running on :5000
- [ ] Frontend running on :3000
- [ ] Sample requests created
- [ ] Jenkins configured

**Demo Flow:**
1. Show dashboard
2. Create API request
3. Execute replay (should pass)
4. Introduce bug in code
5. Push to Git
6. Watch Jenkins detect regression
7. Show report with differences

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find process
netstat -ano | findstr :5000

# Kill process
taskkill /PID <process-id> /F
```

### MongoDB Not Running
```powershell
# Check status
Get-Service MongoDB

# Start service
Start-Service MongoDB

# Or start manually
mongod --dbpath="C:\data\db"
```

### Dependencies Issues
```powershell
# Clear and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
```

### Docker Issues
```powershell
# Restart Docker Desktop
# Then:
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview |
| SETUP_GUIDE.md | Step-by-step installation |
| PROJECT_STRUCTURE.md | Architecture details |
| DEMO_SCRIPT.md | Viva demonstration guide |
| QUICK_REFERENCE.md | This file |

## 🎓 ASE Topics Coverage

✅ DevOps & CI/CD (Jenkins pipeline)
✅ Containerization (Docker)
✅ Testing (Unit, Functional, Regression)
✅ Code Quality (SonarQube)
✅ Security (Data sanitization)
✅ Monitoring (Health checks)
✅ Cloud Deployment (AWS/Azure ready)
✅ Version Control (Git)
✅ Build Automation (npm scripts)
✅ Documentation (Comprehensive)

## 💡 Quick Tips

1. **Use Docker** for easiest setup
2. **Check logs** when something breaks
3. **Read error messages** carefully
4. **Use Postman** for API testing during development
5. **Keep MongoDB running** always
6. **Commit often** to trigger Jenkins

## 🆘 Get Help

1. Check console logs (browser & terminal)
2. Read error messages
3. Check MongoDB is running
4. Verify ports are not in use
5. Review SETUP_GUIDE.md
6. Check Docker container logs

## 📞 Support Commands

```powershell
# Check what's running
Get-Process node
Get-Service MongoDB
docker ps

# View backend logs
cd backend
Get-Content -Path "*.log" -Tail 50

# View Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

**Keep this reference handy during development and demo! 📋**
