# API ReplayLab - Complete Setup Guide

## Step-by-Step Installation for Windows

### Part 1: Prerequisites Installation

#### 1. Install Node.js
```
1. Visit https://nodejs.org/
2. Download LTS version (18.x or higher)
3. Run installer
4. Verify: node --version && npm --version
```

#### 2. Install MongoDB
```
1. Visit https://www.mongodb.com/try/download/community
2. Download Windows installer
3. Install as a service
4. Verify: mongo --version
```

#### 3. Install Git
```
1. Visit https://git-scm.com/downloads
2. Download and install
3. Verify: git --version
```

#### 4. Install Docker Desktop
```
1. Visit https://www.docker.com/products/docker-desktop
2. Download and install
3. Start Docker Desktop
4. Verify: docker --version
```

### Part 2: Project Setup

#### 1. Navigate to Project
```powershell
cd "d:\Materialss\Btech\Semester-7\ASE\Project\API-ReplayLab"
```

#### 2. Setup Backend
```powershell
cd backend
npm install
copy .env.example .env
# Open .env and configure if needed
cd ..
```

#### 3. Setup Frontend
```powershell
cd frontend
npm install
cd ..
```

#### 4. Start MongoDB
```powershell
# If installed as service, it should already be running
# Or start manually:
mongod --dbpath="C:\data\db"
```

### Part 3: Running the Application

#### Option A: Manual Start (Development)

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Option B: Docker Start (Production-like)

```powershell
cd docker
docker-compose up -d
```

**Access:**
- Same URLs as above
- Stop: `docker-compose down`

### Part 4: Jenkins Setup

#### 1. Install Jenkins
```powershell
# Download from: https://www.jenkins.io/download/
# Run installer
# Access: http://localhost:8080
# Follow setup wizard
```

#### 2. Install Required Plugins
```
1. Go to: Manage Jenkins > Manage Plugins
2. Install:
   - NodeJS Plugin
   - Docker Plugin
   - SonarQube Scanner
   - Email Extension Plugin
   - Pipeline Plugin
```

#### 3. Configure Tools
```
1. Manage Jenkins > Global Tool Configuration
2. Add NodeJS: Name="Node18", Version="18.x"
3. Add SonarQube Scanner
```

#### 4. Create Pipeline Job
```
1. New Item > Pipeline
2. Name: "API-ReplayLab-Pipeline"
3. Pipeline Definition: "Pipeline script from SCM"
4. SCM: Git
5. Repository URL: <your-repo-url>
6. Script Path: jenkins/Jenkinsfile
7. Save
```

### Part 5: SonarQube Setup

#### 1. Start SonarQube (Docker)
```powershell
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

#### 2. Configure SonarQube
```
1. Access: http://localhost:9000
2. Default login: admin/admin
3. Create new project: "api-replaylab"
4. Generate token
5. Save token for Jenkins
```

#### 3. Add to Jenkins
```
1. Manage Jenkins > Configure System
2. SonarQube servers section
3. Add SonarQube:
   - Name: "SonarQube"
   - Server URL: http://localhost:9000
   - Token: <your-token>
4. Save
```

### Part 6: First Test Run

#### 1. Create Sample Request
```
1. Open http://localhost:3000
2. Go to "Request Library"
3. Click "New Request"
4. Fill:
   - Name: "Test API"
   - Method: GET
   - URL: https://jsonplaceholder.typicode.com/todos/1
5. Save
```

#### 2. Run Replay
```
1. Go to "Replay Runner"
2. Select your request
3. Click "Execute"
4. Wait for results
```

#### 3. View Results
```
1. Go to Dashboard
2. See recent activity
3. Click "View Details"
```

### Part 7: Jenkins Pipeline Test

#### 1. Trigger Build
```
1. Open Jenkins: http://localhost:8080
2. Select your pipeline
3. Click "Build Now"
4. Watch console output
```

#### 2. Expected Pipeline Flow
```
✓ Checkout code
✓ Install dependencies
✓ Run linter
✓ Run unit tests
✓ SonarQube analysis
✓ Quality gate check
✓ Build application
✓ Regression tests
✓ Docker build (on main branch)
✓ Deploy (on main branch)
```

### Part 8: Demonstration Scenario

#### 1. Create Baseline
```
1. Create API request for order calculation
2. Set expected response: { "total": 1500 }
3. Execute and verify it passes
```

#### 2. Introduce Bug
```javascript
// In your API code, change:
const total = items.reduce((sum, item) => sum + item.price, 0);
// To (wrong):
const total = items.reduce((sum, item) => sum + item.price - 100, 0);
```

#### 3. Trigger Pipeline
```
git add .
git commit -m "Updated pricing logic"
git push origin main
```

#### 4. Watch Jenkins
```
1. Pipeline starts automatically
2. All tests pass until...
3. Regression testing stage
4. ReplayLab detects pricing difference
5. Pipeline FAILS
6. Deployment BLOCKED
7. Team receives email notification
```

## Troubleshooting

### MongoDB Connection Error
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start if stopped
Start-Service MongoDB
```

### Port Already in Use
```powershell
# Find process using port
netstat -ano | findstr :5000

# Kill process
taskkill /PID <process-id> /F
```

### Jenkins Build Fails
```
1. Check Jenkins console output
2. Verify NodeJS installation in Jenkins
3. Ensure MongoDB is running
4. Check firewall settings
```

### Docker Issues
```powershell
# Restart Docker Desktop
# Clear containers
docker-compose down -v
docker system prune -a
```

## Next Steps

1. ✅ Complete basic setup
2. ✅ Test application locally
3. ✅ Configure Jenkins pipeline
4. ✅ Run first automated build
5. ✅ Demonstrate regression detection
6. ✅ Prepare viva presentation

## Quick Commands Reference

```powershell
# Start development
cd backend && npm run dev
cd frontend && npm run dev

# Run tests
cd backend && npm test

# Docker start
cd docker && docker-compose up -d

# Docker stop
cd docker && docker-compose down

# View logs
docker-compose logs -f

# Rebuild
docker-compose up -d --build
```

## Support

For issues, check:
1. Console error messages
2. MongoDB logs
3. Jenkins console output
4. Docker container logs

---

**You're now ready to demonstrate your ASE project! 🚀**
